import { connectionMap } from "./index";
import { UserId, WebSocketSubType } from "@midishare/common";

export function send(
  subType: WebSocketSubType,
  userId: UserId,
  data: string
): void {
  if (!connectionMap[subType][userId]) {
    connectionMap[subType][userId] = [];
  }
  for (const socket of connectionMap[subType][userId]) {
    socket.send(data);
  }
}
