import { create, ReturnContext } from "./connections/create";
import {
  UserId,
  WebSocketSessionDataArgs,
  WebSocketSubType,
} from "@midishare/common";

export function initializeSessionDataWebSocket(
  args: WebSocketSessionDataArgs
): ReturnContext {
  return create({
    type: WebSocketSubType.SESSION_DATA,
    ...args,
  });
}
