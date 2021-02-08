import WebSocket from "ws";
import { connectionMap } from "./index";
import { keepAlive } from "./keepAlive";
import { remove } from "./remove";
import {
  SignalingMessage,
  UserId,
  WebSocketSubType,
  WebSocketSubTypeArgs,
} from "@midishare/common";
import { handleSignalingMessage } from "../handleSignalingMessage";

/**
 * Keep an eye on add/remove event listener memory leaks
 * */
export function add(
  args: WebSocketSubTypeArgs,
  userId: UserId,
  socket: WebSocket
): void {
  if (!connectionMap[args.type][userId]) {
    connectionMap[args.type][userId] = [];
  }

  socket.on("close", (code, reason) => {
    console.warn(`WS CLOSE [code=${code}, reason=${reason}]`);
    remove(args.type, userId, socket);
  });

  socket.on("error", (error) => {
    console.warn(`WS ERROR [code=${error.message}]`, error);
    remove(args.type, userId, socket);
  });

  socket.on("message", (data) => {
    console.debug(
      `WS[type="${args.type}", userId="${userId}"] message received`,
      data
    );

    if (args.type === WebSocketSubType.SIGNALING) {
      handleSignalingMessage(userId, args, data.toString());
    }
  });

  keepAlive(args.type, userId, socket);

  connectionMap[args.type][userId].push(socket);
  console.debug(
    `WS ADD [type=${args.type}, userId=${userId}]`,
    args.type,
    userId,
    connectionMap
  );
}
