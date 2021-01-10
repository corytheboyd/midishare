import WebMidi from "webmidi";

export async function getMidiAccess(): Promise<void> {
  return new Promise((resolve, reject) => {
    WebMidi.enable((error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    }, true);
  });
}
