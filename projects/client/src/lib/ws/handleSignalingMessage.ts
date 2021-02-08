import {
  Session,
  SignalingMessage,
  UserProfile,
  WebSocketSessionDataArgs,
  WebSocketSubType,
} from "@midishare/common";
import { negotiationState, peerConnection } from "../rtc/usePeerConnection";
import { queryClient } from "../queryClient";
import { queryKey as currentUserQueryKey } from "../queries/getCurrentUser";
import { queryKey as getSessionQueryKey } from "../queries/getSession";
import { send } from "./connections/send";

/**
 * Implements last half of perfect negotiation
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation
 * */
export async function handleSignalingMessage(
  args: WebSocketSessionDataArgs,
  data: string
): Promise<void> {
  if (!peerConnection) {
    console.error(
      `WS[type="${WebSocketSubType.SIGNALING}"] received signaling message but peer connection not created`,
      args,
      data
    );
    return;
  }

  let message: SignalingMessage;
  try {
    message = JSON.parse(data);
  } catch (error) {
    console.warn(
      `WS[type="${WebSocketSubType.SIGNALING}"]: failed to parse message`,
      args,
      data
    );
    return;
  }

  if (message.candidate) {
    const candidate: RTCIceCandidateInit = JSON.parse(message.candidate);
    try {
      await peerConnection.addIceCandidate(candidate);
    } catch (err) {
      console.warn(
        `WS[type="${WebSocketSubType.SIGNALING}"]: failed to add ICE candidate`,
        args,
        candidate
      );
      if (!negotiationState.ignoreOffer) {
        throw err;
      }
    }
  }

  if (message.description) {
    const description: RTCSessionDescriptionInit = JSON.parse(
      message.description
    );

    const offerCollision =
      description.type === "offer" &&
      (negotiationState.makingOffer ||
        peerConnection.signalingState !== "stable");

    const user = queryClient.getQueryData<UserProfile>(currentUserQueryKey());
    const session = queryClient.getQueryData<Session>(
      getSessionQueryKey(args.sessionId)
    );
    if (!session) {
      console.warn(
        `WS[type="${WebSocketSubType.SIGNALING}"]: cannot determine polite, negotiation broken`,
        args,
        data
      );
      return;
    }
    const polite = user && user.sub === session.participants.host;

    negotiationState.ignoreOffer = !polite && offerCollision;
    if (negotiationState.ignoreOffer) {
      return;
    }

    await peerConnection.setRemoteDescription(description);

    if (description.type === "offer") {
      // TODO fix setLocalDescription typing
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await peerConnection.setLocalDescription();
      send(
        WebSocketSubType.SIGNALING,
        JSON.stringify(peerConnection.localDescription!)
      );
    }
  }
}
