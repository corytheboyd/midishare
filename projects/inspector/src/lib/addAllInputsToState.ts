import WebMidi from "webmidi";
import { addInput } from "./addInput";

export function addAllInputsToState(): void {
  for (const input of WebMidi.inputs) {
    addInput(input);
  }
}
