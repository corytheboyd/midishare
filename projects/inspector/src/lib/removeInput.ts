import { DeviceId, store } from "./store";

export function removeInput(id: DeviceId): void {
  // Removes all listeners. If this input comes back, it will have listeners
  // registered again.
  const input = store.getState().inputs[id];
  input.removeListener();

  const removeInput = store.getState().removeInput;
  removeInput(id);
}
