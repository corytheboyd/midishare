/**
 * Processes MIDI data received from local MIDI input device. Plays the local
 * peer keyboard and sends data to the remote peer.
 *
 * @see https://newt.phys.unsw.edu.au/jw/notes.html
 * @see https://www.midi.org/specifications-old/item/table-1-summary-of-midi-message
 * */
import { InputEvents } from "webmidi";
import { store } from "./store";
import { PeerConnection } from "./rtc/PeerConnection";
import { playKeyboard } from "./playKeyboard";

// Restrict allowable event types to prevent registering something new that
// we don't yet know how to handle. Let's goooo strong types!
export type AllowedInputEventTypes = "noteon" | "noteoff" | "controlchange";

export function handleMidiInput(
  eventType: Extract<keyof InputEvents, AllowedInputEventTypes>,
  timestamp: number,
  data: Uint8Array
): void {
  const runtime = store.getState().runtime?.localKeyboardRuntime;
  if (!runtime) {
    throw new Error("Runtime not initialized");
  }
  playKeyboard(eventType, timestamp, data, runtime);
  PeerConnection.sendMidiData(data, timestamp);
}
