import { SessionDataWebSocketArgs, WebSocketSubType } from "@midishare/common";
import { initializeWebSocket, ReturnContext } from "./initializeWebSocket";

export function initializeSignalingWebSocket(): ReturnContext {
  return initializeWebSocket<SessionDataWebSocketArgs>(
    WebSocketSubType.SIGNALING
  );
}
