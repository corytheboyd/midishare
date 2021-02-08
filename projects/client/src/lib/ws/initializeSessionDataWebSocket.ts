import { create, ReturnContext } from "./connections/create";
import { WebSocketSubType } from "@midishare/common";

export function initializeSessionDataWebSocket(
  sessionId: string
): ReturnContext {
  return create({
    type: WebSocketSubType.SESSION_DATA,
    sessionId,
  });
}
