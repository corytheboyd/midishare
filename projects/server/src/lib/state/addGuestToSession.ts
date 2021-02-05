import { store } from "./store";
import { UserId } from "@midishare/common";

export function addGuestToSession(sessionId: string, userId: UserId): void {
  store.getState().addGuestToSession(sessionId, userId);
}
