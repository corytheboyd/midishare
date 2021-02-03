import WebMidi from "webmidi";
import { store } from "./store";

export function getMidiAccess(): void {
  if (store.getState().midiAccessGranted !== null) {
    return;
  }

  WebMidi.enable((error) => {
    if (error) {
      store.getState().setMidiAccessGranted(false);
      return;
    }
    store.getState().setMidiAccessGranted(true);

    for (const input of WebMidi.inputs) {
      store.getState().addMidiInputDevice(input);
    }

    WebMidi.addListener("connected", (event) => {
      if (event.port.type !== "input") {
        return;
      }
      store.getState().addMidiInputDevice(event.port);
    });

    WebMidi.addListener("disconnected", (event) => {
      if (event.port.type !== "input") {
        return;
      }
      store.getState().removeMidiInputDevice(event.port.id);
    });
  }, true);
}
