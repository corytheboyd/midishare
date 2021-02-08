import { SignalingMessage, WebSocketSubType } from "@midishare/common";
import { send } from "./connections/send";

export function sendSignalingMessage(message: SignalingMessage): Promise<void> {
  return send(WebSocketSubType.SIGNALING, JSON.stringify(message));
}
