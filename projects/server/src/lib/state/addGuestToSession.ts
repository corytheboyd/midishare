import { store } from "./store";

export function addGuestToSession(sessionId: string, guestSub: string): void {
  store.getState().addGuestToSession(sessionId, guestSub);
}
