import { WebSocketSubType } from "@midishare/common";
import { webSocketMap } from "./index";

export async function send<TMessage>(
  subType: WebSocketSubType,
  message: TMessage
): Promise<void> {
  const ws = await webSocketMap[subType];
  if (!ws) {
    console.warn(
      `WS[type="${subType}"] failed to send, socket not initialized`
    );
    return;
  }
  console.info(`WS[type="${subType}"] message sent`);
  ws.send(JSON.stringify(message));
}
