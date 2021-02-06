import { WSSubType } from "../types";
import WebSocket from "ws";
import { UserId } from "@midishare/common";
import { remove } from "./remove";

const WS_KEEPALIVE_TIMEOUT_MS = 1000;

export function keepAlive(
  subType: WSSubType,
  userId: UserId,
  socket: WebSocket
): void {
  const intervalId = setInterval(() => {
    socket.ping(null, false, (error) => {
      if (error) {
        remove(subType, userId, socket);
        clearInterval(intervalId);
      }
    });
  }, WS_KEEPALIVE_TIMEOUT_MS);
}
