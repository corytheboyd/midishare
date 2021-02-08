import {
  UserId,
  WebSocketSignalingArgs,
  WebSocketSubType,
} from "@midishare/common";
import { create, ReturnContext } from "./connections/create";

export function initializeSignalingWebSocket(
  args: WebSocketSignalingArgs
): ReturnContext {
  return create({
    type: WebSocketSubType.SIGNALING,
    ...args,
  });
}
