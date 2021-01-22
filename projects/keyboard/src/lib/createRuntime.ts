import { Runtime, RuntimeOptions } from "./Runtime";
import { createStore } from "./createStore";
import { runtimeLogger } from "./debug";

export function createRuntime(options: RuntimeOptions = {}): Runtime {
  runtimeLogger("createRuntime()");
  const store = createStore();
  return new Runtime(store, options);
}
