import { AllowedInputEventTypes } from "../createMidiInputHandler";
import { getKeyNameFromIndex } from "@midishare/keyboard";
import { store } from "../store";

export function handleMidiData(messageData: Buffer): void {
  const [timestampRaw, ...midiRaw] = messageData.toString().split(",");

  // TODO implement clock sync delay from this
  const timestamp = parseFloat(timestampRaw);

  const [status, ...data] = Uint8Array.from(
    midiRaw.map((s) => parseInt(s, 10))
  );

  let eventType: AllowedInputEventTypes;
  if (status === 144) {
    if (data[1] <= 0) {
      eventType = "noteoff";
    } else {
      eventType = "noteon";
    }
  } else if (status === 128) {
    eventType = "noteoff";
  } else if (status === 176) {
    eventType = "controlchange";
  } else {
    console.warn("UNHANDLED MIDI MESSAGE TYPE", status, data);
    return;
  }

  if (eventType === "noteoff" || eventType === "noteon") {
    const keyName = getKeyNameFromIndex(data[0] - 21);
    if (eventType === "noteon") {
      store.getState().runtime?.remoteKeyboardRuntime.keyOn(keyName, data[1]);
    } else {
      store.getState().runtime?.remoteKeyboardRuntime.keyOff(keyName);
    }
  }
}
