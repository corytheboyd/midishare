import { SignalingMessage, WebSocketSubType } from "@midishare/common";
import { send } from "./connections/send";

export function sendSignalingMessage<T = SignalingMessage>(message: T): void {
  send<T>(WebSocketSubType.SIGNALING, message);
}
