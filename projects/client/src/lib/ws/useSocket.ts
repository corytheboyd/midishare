import { WebSocketSubTypeArgs } from "@midishare/common";
import { useEffect, useMemo } from "react";
import { Socket } from "./Socket";

export function useSocket(args: WebSocketSubTypeArgs): Socket {
  const socket = useMemo(() => Socket.instance(args), []);

  useEffect(() => {
    return () => Socket.destroy(args.type);
  }, []);

  return socket;
}
