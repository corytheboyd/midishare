import { WebSocketSubType } from "@midishare/common";
import { webSocketMap } from "./index";

export async function send(
  subType: WebSocketSubType,
  data: string
): Promise<void> {
  const ws = await webSocketMap[subType];
  if (!ws) {
    console.warn(
      `WS[type="${subType}"] failed to send, socket not initialized`
    );
    return;
  }
  console.info(`WS[type="${subType}"] message sent`);
  ws.send(data);
}
