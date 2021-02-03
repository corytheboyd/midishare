import WebMidi, { InputEvents } from "webmidi";
import { store } from "./store";
import { handleMidiInput } from "./handleMidiInput";

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

    WebMidi.addListener("connected", (event) => {
      if (event.port.type !== "input") {
        return;
      }
      store.getState().addMidiInputDevice(event.port);

      event.port.addListener("noteon", "all", (event) => {
        handleMidiInput(
          event.target.id,
          event.type,
          event.data,
          event.timestamp
        );
      });
      event.port.addListener("noteoff", "all", (event) => {
        handleMidiInput(
          event.target.id,
          event.type,
          event.data,
          event.timestamp
        );
      });
      event.port.addListener("controlchange", "all", (event) => {
        handleMidiInput(
          event.target.id,
          event.type,
          event.data,
          event.timestamp
        );
      });
    });

    WebMidi.addListener("disconnected", (event) => {
      if (event.port.type !== "input") {
        return;
      }
      store.getState().removeMidiInputDevice(event.port.id);
    });
  }, true);
}
