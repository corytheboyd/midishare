import { Runtime, RuntimeOptions } from "./Runtime";
import { createStore } from "./createStore";
import { runtimeLogger } from "./debug";

const runtimeMap: Record<string, Runtime> = {};

export function createRuntime(options: RuntimeOptions): Runtime {
  runtimeLogger("createRuntime()");

  if (runtimeMap[options.id]) {
    throw new Error(
      `Keyboard Runtime with this id already exists: ${options.id}`
    );
  }

  const store = createStore();
  const runtime = new Runtime(store, options);
  runtimeMap[options.id] = runtime;
  return runtime;
}
