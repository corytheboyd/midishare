import { sendSignalingMessage } from "../ws/sendSignalingMessage";

let peerConnection: RTCPeerConnection | null = null;

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
  peerConnection = new RTCPeerConnection();
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

let makingOffer = false;
function registerEventHandlers(pc: RTCPeerConnection): void {
  pc.onnegotiationneeded = async () => {
    console.debug("RTC: negotiation needed");

    try {
      makingOffer = true;

      // TODO fix typing forcing a description argument
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await pc.setLocalDescription();

      sendSignalingMessage({
        description: pc.localDescription!,
      });
    } catch (err) {
      console.error("RTC: error sending initial offer", err);
    } finally {
      makingOffer = false;
    }
  };

  pc.onicecandidate = (event) => {
    if (!event.candidate) {
      return;
    }
    console.debug("RTC: has ice candidate", event.candidate);
    sendSignalingMessage({
      candidate: event.candidate,
    });
  };

  pc.onsignalingstatechange = () => {
    console.debug("RTC: signaling state change", pc.signalingState);
  };

  pc.onconnectionstatechange = () => {
    console.debug("RTC: connection state change", pc.connectionState);
  };
}
