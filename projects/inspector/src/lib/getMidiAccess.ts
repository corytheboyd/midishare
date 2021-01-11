import WebMidi from "webmidi";
import { store } from "../store";

export async function getMidiAccess(): Promise<void> {
  const makeReady = store.getState().makeReady;

  return new Promise((resolve, reject) => {
    WebMidi.enable((error) => {
      if (error) {
        return reject(error);
      }
      makeReady();
      resolve();
    }, true);
  });
}
