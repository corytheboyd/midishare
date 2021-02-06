import { connectionMap } from "./index";
import WebSocket from "ws";
import {
  UserId,
  WebSocketCloseCode,
  WebSocketSubType,
} from "@midishare/common";

/**
 * TODO and a BIG one! close sockets on server restart with appropriate codes
 *  to signal that the client should or should not attempt a reconnect.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#status_codes
 * */
export function close(
  code: WebSocketCloseCode,
  reason?: string,
  subType?: WebSocketSubType,
  userId?: UserId
): void {
  if (subType && userId) {
    if (!connectionMap[subType][userId]) {
      return;
    }
    for (const socket of connectionMap[subType][userId]) {
      socket.close(code, reason);
    }
  } else if (subType) {
    const sockets = Object.values(connectionMap[subType]).flat(
      Infinity
    ) as WebSocket[];
    for (const socket of sockets) {
      socket.close(code, reason);
    }
  } else {
    const sockets = Object.values(connectionMap)
      .map((map) => Object.values(map))
      .flat(Infinity) as WebSocket[];
    for (const socket of sockets) {
      socket.close(code, reason);
    }
  }
}
