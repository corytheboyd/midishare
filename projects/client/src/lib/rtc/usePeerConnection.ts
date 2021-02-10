import { useEffect, useMemo } from "react";
import { PeerConnection } from "./PeerConnection";
import { useSocket } from "../ws/useSocket";
import { WebSocketSubType } from "@midishare/common";

export function usePeerConnection(sessionId: string): PeerConnection {
  const socket = useSocket({
    type: WebSocketSubType.SIGNALING,
    sessionId,
  });

  const connection = useMemo(() => PeerConnection.instance(), []);

  useEffect(() => {
    connection.setSignaling(socket);

    return () => PeerConnection.destroy();
  }, []);

  return connection;
}
