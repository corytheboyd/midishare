import { Session } from "@midishare/common";
import { store } from "./store";

export function saveSession(session: Session): void {
  return store.getState().addSession(session);
}
