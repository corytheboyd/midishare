import { store } from "../store";
import { Input } from "webmidi";
import { createInputListeners } from "./createInputListeners";

export function addInput(input: Input): void {
  const addInput = store.getState().addInput;
  addInput(input);
  createInputListeners(input);
}
