import { useEffect, useMemo } from "react";
import { PeerConnection } from "./PeerConnection";
import { useSocket } from "../ws/useSocket";
import { SignalingMessage, WebSocketSubType } from "@midishare/common";

export function usePeerConnection(sessionId: string): PeerConnection {
  const socket = useSocket({
    type: WebSocketSubType.SIGNALING,
    sessionId,
  });

  const connection = useMemo(() => PeerConnection.instance(), []);

  useEffect(() => {
    console.debug("usePeerConnection hook called");

    connection.setSignaling(socket);

    socket.onMessage((data) => {
      let message: SignalingMessage;
      try {
        message = JSON.parse(data);
      } catch (error) {
        return;
      }
      PeerConnection.processSignalingMessage(message);
    });

    return () => PeerConnection.destroy();
  }, []);

  return connection;
}
