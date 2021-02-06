import { WSSubType } from "../types";
import WebSocket from "ws";
import { connectionMap } from "./index";
import { UserId } from "@midishare/common";
import { keepAlive } from "./keepAlive";
import { remove } from "./remove";

/**
 * Keep an eye on add/remove event listener memory leaks
 * */
export function add(
  subType: WSSubType,
  userId: UserId,
  socket: WebSocket
): void {
  if (!connectionMap[subType][userId]) {
    connectionMap[subType][userId] = [];
  }

  socket.on("close", (code, reason) => {
    console.warn(`WS CLOSE EVENT [code=${code}, reason=${reason}]`);
    remove(subType, userId, socket);
  });

  socket.on("error", (error) => {
    console.warn(`WS ERROR EVENT [code=${error.message}]`, error);
    remove(subType, userId, socket);
  });

  keepAlive(subType, userId, socket);

  connectionMap[subType][userId].push(socket);
  console.debug(
    `WS ADD [type=${subType}, userId=${userId}]`,
    subType,
    userId,
    connectionMap
  );
}
