import { InputEvents } from "webmidi";
import { AllowedInputEventTypes } from "./handleMidiInput";
import { getKeyNameFromIndex, Runtime } from "@midishare/keyboard";

export function playKeyboard(
  eventType: Extract<keyof InputEvents, AllowedInputEventTypes>,
  timestamp: number,
  data: Uint8Array,
  runtime: Runtime
): void {
  // Play the local keyboard
  if (eventType === "noteon" || eventType === "noteoff") {
    const [, note, velocity] = data;
    const keyName = getKeyNameFromIndex(note - 21);

    if (eventType === "noteon") {
      runtime.keyOn(keyName, velocity);
    } else {
      runtime.keyOff(keyName);
    }
  }

  if (eventType === "controlchange") {
    // Sustain pedal
    if (data[1] === 64) {
      const isPressed = data[2] === 0;
      if (isPressed) {
        runtime.sustainOn();
      } else {
        runtime.sustainOff();
      }
    }
  }
}
