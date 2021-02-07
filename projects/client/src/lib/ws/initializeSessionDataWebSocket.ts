import { SessionDataWebSocketArgs, WebSocketSubType } from "@midishare/common";
import { initializeWebSocket, ReturnContext } from "./initializeWebSocket";

export function initializeSessionDataWebSocket(
  sessionId: string
): ReturnContext {
  return initializeWebSocket<SessionDataWebSocketArgs>(
    WebSocketSubType.SESSION_DATA,
    {
      sessionId,
    }
  );
}
