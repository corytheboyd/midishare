import { Input } from "webmidi";
import { MessageType, store } from "../store";
import { createMessage } from "./createMessage";

export function createInputListeners(input: Input): void {
  input.addListener("noteon", "all", (event) => {
    const deviceId = event.target.id;

    const message = createMessage(MessageType.MidiData, {
      midiData: event.data,
      timestamp: event.timestamp,
    });

    store.getState().addMessage(deviceId, message);
  });
}
