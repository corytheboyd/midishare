import { useEffect, useMemo } from "react";
import { PeerConnection } from "./PeerConnection";
import { useSocket } from "../ws/useSocket";
import { WebSocketSubType } from "@midishare/common";

export function usePeerConnection(sessionId: string): PeerConnection {
  const socket = useSocket({
    type: WebSocketSubType.SIGNALING,
    sessionId,
  });

  const connection = useMemo(() => {
    console.debug("usePeerConnection: get instance");
    return PeerConnection.instance();
  }, []);

  useEffect(() => {
    console.debug("usePeerConnection: initialize", socket); ////

    connection.setSignaling(socket);

    return () => {
      console.debug("usePeerConnection: cleanup");
      PeerConnection.destroy();
    };
  }, []);

  return connection;
}
