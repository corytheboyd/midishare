/**
 * Processes MIDI data received from local MIDI input device. Plays the local
 * peer keyboard and sends data to the remote peer.
 *
 * @see https://newt.phys.unsw.edu.au/jw/notes.html
 * @see https://www.midi.org/specifications-old/item/table-1-summary-of-midi-message
 * */
import { InputEvents } from "webmidi";
import { store } from "./store";
import { getKeyNameFromIndex } from "@midishare/keyboard";

// Restrict allowable event types to prevent registering something new that
// we don't yet know how to handle. Let's goooo strong types!
type AllowedInputEventTypes = "noteon" | "noteoff" | "controlchange";

export function handleMidiInput(
  inputId: string,
  type: Extract<keyof InputEvents, AllowedInputEventTypes>,
  data: Uint8Array,
  timestamp: number
): void {
  // Play the local keyboard
  if (
    (store.getState().activeMidiInputDeviceId === inputId &&
      type === "noteon") ||
    type === "noteoff"
  ) {
    const [, note, velocity] = data;
    const keyName = getKeyNameFromIndex(note - 21);

    if (type === "noteon") {
      store
        .getState()
        .activeSession?.localKeyboardRuntime.keyOn(keyName, velocity);
    } else {
      store.getState().activeSession?.localKeyboardRuntime.keyOff(keyName);
    }
  }
}
