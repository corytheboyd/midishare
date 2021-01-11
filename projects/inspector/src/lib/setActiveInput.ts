import { DeviceId, store } from "../store";

export function setActiveInput(id: DeviceId): void {
  const setActiveInput = store.getState().setActiveInput;
  setActiveInput(id);
}
