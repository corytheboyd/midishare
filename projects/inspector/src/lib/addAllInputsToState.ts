import WebMidi from "webmidi";
import { store } from "../store";

export function addAllInputsToState(): void {
  const addInput = store.getState().addInput;

  for (const input of WebMidi.inputs) {
    addInput(input);
  }
}
