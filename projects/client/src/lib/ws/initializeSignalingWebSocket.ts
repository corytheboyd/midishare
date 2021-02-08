import { WebSocketSubType } from "@midishare/common";
import { create, ReturnContext } from "./connections/create";

export function initializeSignalingWebSocket(sessionId: string): ReturnContext {
  return create({
    type: WebSocketSubType.SIGNALING,
    sessionId,
  });
}
