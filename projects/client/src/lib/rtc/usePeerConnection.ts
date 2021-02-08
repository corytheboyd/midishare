import { sendSignalingMessage } from "../ws/sendSignalingMessage";

export let peerConnection: RTCPeerConnection | null = null;

let localMidiDataChannel: RTCDataChannel;

type UsePeerConnectionReturnContext = {
  peerConnection: RTCPeerConnection | null;
  start: () => void;
  close: () => void;
};

/**
 * WIP, not sure if react hook convention is best yet
 * */
export function usePeerConnection(): UsePeerConnectionReturnContext {
  if (!peerConnection) {
    peerConnection = create();
  }
  return {
    peerConnection,
    start: () => {
      console.debug("RTC: start return context function called");
      start();
    },
    close: () => {
      console.debug("RTC: close return context function called");
      close();
    },
  };
}

function start() {
  if (!peerConnection) {
    console.warn("RTC: peer connection not created");
    return;
  }
  localMidiDataChannel = peerConnection.createDataChannel("MIDI");
}

function create() {
  console.info("RTC: create new peer connection");
  peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
  });
  registerEventHandlers(peerConnection);
  return peerConnection;
}

function close() {
  if (!peerConnection) {
    console.warn("RTC: peer connection not created");
  }
  peerConnection?.close();
  peerConnection = null;
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation
 * */
export const negotiationState = {
  makingOffer: false,
  ignoreOffer: false,
};

function registerEventHandlers(pc: RTCPeerConnection): void {
  pc.onnegotiationneeded = async () => {
    console.debug("RTC: negotiation needed");

    try {
      negotiationState.makingOffer = true;

      // TODO fix typing forcing a description argument
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await pc.setLocalDescription();

      sendSignalingMessage({
        description: JSON.stringify(pc.localDescription),
      });
    } catch (err) {
      console.error("RTC: error sending initial offer", err);
    } finally {
      negotiationState.makingOffer = false;
    }
  };

  pc.onicecandidate = (event) => {
    if (!event.candidate) {
      return;
    }
    console.debug("RTC: has ice candidate", event.candidate);
    sendSignalingMessage({
      candidate: JSON.stringify(event.candidate),
    });
  };

  pc.onsignalingstatechange = () => {
    console.debug("RTC: signaling state change", pc.signalingState);
  };

  pc.onconnectionstatechange = () => {
    console.debug("RTC: connection state change", pc.connectionState);
  };
}
