import { Session } from "@midishare/common";
import { store } from "./store";

export function getSession(id: string): Session | undefined {
  return store.getState().sessions[id];
}
