import WebSocket from "ws";
import { remove } from "./remove";
import { UserId, WebSocketSubType } from "@midishare/common";

const WS_KEEPALIVE_TIMEOUT_MS = 1000;

export function keepAlive(
  subType: WebSocketSubType,
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
