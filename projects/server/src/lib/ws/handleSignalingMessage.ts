import { SignalingMessage, WebSocketSignalingArgs } from "@midishare/common";

export function handleSignalingMessage(
  args: WebSocketSignalingArgs,
  message: SignalingMessage
): void {
  console.debug("SIGNALING MESSAGE", args, message);
}
