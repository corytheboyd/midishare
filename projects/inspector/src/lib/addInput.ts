import { store } from "./store";
import { Input } from "webmidi";
import { createInputListeners } from "./createInputListeners";
import { deviceLogger } from "./debug";

export function addInput(input: Input): void {
  if (store.getState().inputs[input.id]) {
    deviceLogger(`Device already registered: ${input.name} (${input.name})`);
    return;
  }

  const addInput = store.getState().addInput;
  addInput(input);

  createInputListeners(input);
}
