import { WSSubType } from "../types";
import WebSocket from "ws";
import { connectionMap } from "./index";
import { UserId } from "@midishare/common";

export function remove(
  subType: WSSubType,
  userId: UserId,
  socket: WebSocket
): void {
  if (!connectionMap[subType][userId]) {
    connectionMap[subType][userId] = [];
  }
  connectionMap[subType][userId] = connectionMap[subType][userId].filter(
    (ws) => ws !== socket
  );
  socket.close();

  // Prevent memory leak of empty list after killing all sockets for this
  // subtype/user. Instead, rely on lazily creating the array.
  if (connectionMap[subType][userId].length === 0) {
    delete connectionMap[subType][userId];
  }

  console.debug("WS KILL", subType, userId, connectionMap);
}
