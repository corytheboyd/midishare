import WebMidi, {
  InputEventControlchange,
  InputEventNoteoff,
  InputEventNoteon,
} from "webmidi";
import { store } from "./store";
import { createMidiInputHandler } from "./createMidiInputHandler";
import { ISessionShowContext } from "../views/pages/Sessions/Show/SessionShowContext";

export function getMidiAccess(context: ISessionShowContext): void {
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

      const eventListenerCallback = createMidiInputHandler(context);

      event.port.addListener("noteon", "all", eventListenerCallback);
      event.port.addListener("noteoff", "all", eventListenerCallback);
      event.port.addListener("controlchange", "all", eventListenerCallback);
    });

    WebMidi.addListener("disconnected", (event) => {
      if (event.port.type !== "input") {
        return;
      }
      store.getState().removeMidiInputDevice(event.port.id);
    });
  }, true);
}
