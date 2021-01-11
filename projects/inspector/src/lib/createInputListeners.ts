import { Input } from "webmidi";
import { store } from "../store";

export function createInputListeners(input: Input): void {
  input.addListener("noteon", "all", (event) => {
    const deviceId = event.target.id;
    const data = event.data;
    const timestamp = event.timestamp;

    store.getState().addMessage(deviceId, { data, timestamp });
  });
}
