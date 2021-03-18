import { InputEvents } from "webmidi";
import { AllowedInputEventTypes } from "./createMidiInputHandler";
import { getKeyNameFromIndex } from "@midishare/keyboard";
import { ISessionShowContext } from "../views/pages/Sessions/Show/SessionShowContext";

const SUSTAIN_PEDAL_CONTROL_CODE = 64;

export function playKeyboard(
  targetRuntime: "local" | "remote",
  eventType: Extract<keyof InputEvents, AllowedInputEventTypes>,
  timestamp: number,
  data: Uint8Array,
  context: ISessionShowContext
): void {
  const runtime =
    targetRuntime === "local" ? context.localRuntime : context.remoteRuntime;

  const runtimeOptions =
    targetRuntime === "local"
      ? context.localRuntimeOptions
      : context.remoteRuntimeOptions;

  if (!runtime) {
    throw new Error("Failed to play keyboard: target runtime does not exist");
  }

  if (!runtimeOptions) {
    throw new Error(
      "Failed to play keyboard: target runtimeOptions does not exist"
    );
  }

  // Play notes
  if (eventType === "noteon" || eventType === "noteoff") {
    const [, note, velocity] = data;
    const keyName = getKeyNameFromIndex(note - 21);

    if (eventType === "noteon") {
      runtime.keyOn(keyName, velocity);
    } else {
      runtime.keyOff(keyName);
    }
  }

  // Sustain pedal
  if (eventType === "controlchange") {
    if (data[1] === SUSTAIN_PEDAL_CONTROL_CODE) {
      const isPressed = runtimeOptions.sustainInverted
        ? data[2] > 0
        : data[2] === 0;

      if (isPressed) {
        runtime.sustainOn();
      } else {
        runtime.sustainOff();
      }
    }
  }
}
