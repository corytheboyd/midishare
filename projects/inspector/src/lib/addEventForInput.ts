import { DeviceId, store } from "../store";
import { InputEventBase, InputEvents } from "webmidi";

export function addEventForInput(
  deviceId: DeviceId,
  event: InputEventBase<keyof InputEvents>
): void {
  const { addEvent } = store.getState();

  addEvent(event.target.id, event);
}
