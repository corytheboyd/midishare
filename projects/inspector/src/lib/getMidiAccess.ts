import WebMidi from "webmidi";
import { baseLogger } from "./debug";

export async function getMidiAccess(): Promise<void> {
  return new Promise((resolve, reject) => {
    WebMidi.enable((error) => {
      if (error) {
        baseLogger(`MIDI not accessible! Error: ${error}`);
        return reject(error);
      }
      baseLogger("MIDI access granted");
      resolve();
    }, true);
  });
}
