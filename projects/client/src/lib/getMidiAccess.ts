import WebMidi, {
  InputEventControlchange,
  InputEventNoteoff,
  InputEventNoteon,
  InputEvents,
} from "webmidi";
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

      const eventListenerCallback = (
        event: InputEventNoteon | InputEventNoteoff | InputEventControlchange
      ) => {
        if (store.getState().activeMidiInputDeviceId !== event.target.id) {
          return;
        }
        handleMidiInput(event.type, event.data, event.timestamp);
      };

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
