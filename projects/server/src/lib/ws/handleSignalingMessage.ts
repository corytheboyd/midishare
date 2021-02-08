import {
  SignalingMessage,
  UserId,
  WebSocketSignalingArgs,
  WebSocketSubType,
} from "@midishare/common";
import { getSession } from "../state/getSession";
import { send } from "./connections/send";

export async function handleSignalingMessage(
  sender: UserId,
  args: WebSocketSignalingArgs,
  message: SignalingMessage
): Promise<void> {
  const { sessionId } = args;
  if (!sessionId) {
    console.warn(`WS[type="${WebSocketSubType.SIGNALING}"] missing sessionId`);
    return;
  }

  const session = await getSession(sessionId);
  if (!session) {
    console.warn(`WS[type="${WebSocketSubType.SIGNALING}"] session not found`);
    return;
  }

  let otherUserId: UserId | undefined;
  if (sender === session.participants.host) {
    otherUserId = session.participants.guest;
  } else {
    otherUserId = session.participants.host;
  }

  if (!otherUserId) {
    console.warn(`WS[type="${WebSocketSubType.SIGNALING}"] not enough peers`);
    return;
  }

  console.debug(
    `WS[type="${WebSocketSubType.SIGNALING}"] forward message to other peer`,
    sender,
    otherUserId
  );
  send(WebSocketSubType.SIGNALING, otherUserId, JSON.stringify(message));
}
