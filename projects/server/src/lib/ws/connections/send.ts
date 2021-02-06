import { WSSubType } from "../types";
import { connectionMap } from "./index";
import { UserId } from "@midishare/common";

export function send(subType: WSSubType, userId: UserId, data: string): void {
  if (!connectionMap[subType][userId]) {
    connectionMap[subType][userId] = [];
  }
  for (const socket of connectionMap[subType][userId]) {
    socket.send(data);
  }
}
