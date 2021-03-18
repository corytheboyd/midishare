/**
 * Processes MIDI data received from local MIDI input device. Plays the local
 * peer keyboard and sends data to the remote peer.
 *
 * @see https://newt.phys.unsw.edu.au/jw/notes.html
 * @see https://www.midi.org/specifications-old/item/table-1-summary-of-midi-message
 * */
import {
  InputEventControlchange,
  InputEventNoteoff,
  InputEventNoteon,
  InputEvents,
} from "webmidi";
import { store } from "./store";
import { PeerConnection } from "./rtc/PeerConnection";
import { playKeyboard } from "./playKeyboard";
import { Session } from "@midishare/common";
import {
  buildSessionShowContext,
  ISessionShowContext,
} from "../views/pages/Sessions/Show/SessionShowContext";
import { queryClient } from "./queryClient";
import { queryKey as currentUserQueryKey } from "./queries/getCurrentUser";
import { queryKey as sessionQueryKey } from "./queries/getSession";

// Restrict allowable event types to prevent registering something new that
// we don't yet know how to handle. Let's goooo strong types!
export type AllowedInputEventTypes = "noteon" | "noteoff" | "controlchange";

export function createMidiInputHandler(
  context: ISessionShowContext
): (
  event: InputEventNoteon | InputEventNoteoff | InputEventControlchange
) => void {
  if (!context.session) {
    throw new Error("Cannot create MIDI input handler without session");
  }

  const sessionId = context.session.id;

  return (event) => {
    // Ignore events from inactive MIDI devices, but don't unregister
    // the listeners.
    if (store.getState().activeMidiInputDeviceId !== event.target.id) {
      return;
    }

    const eventType: Extract<keyof InputEvents, AllowedInputEventTypes> =
      event.type;
    const timestamp = event.timestamp;
    const data = event.data;

    const runtime = store.getState().runtime?.localKeyboardRuntime;
    if (!runtime) {
      throw new Error("Runtime not initialized");
    }
    playKeyboard(
      "local",
      eventType,
      timestamp,
      data,
      // TODO this is a tight coupling, but it might be fine tbh
      buildSessionShowContext({
        currentUser: queryClient.getQueryData(currentUserQueryKey()),
        session: queryClient.getQueryData(sessionQueryKey(sessionId)),
      })
    );
    PeerConnection.sendMidiData(data, timestamp);
  };
}
