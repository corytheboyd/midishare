import WebMidi from "webmidi";
import { deviceLogger } from "./debug";
import { removeInput } from "./removeInput";
import { addInput } from "./addInput";

export function createDeviceListeners(): void {
  WebMidi.addListener("connected", (event) => {
    if (event.port.type === "input") {
      deviceLogger(`Device connected: ${event.port.name} (${event.port.id})`);
      addInput(event.port);
    }
  });

  WebMidi.addListener("disconnected", (event) => {
    if (event.port.type === "input") {
      deviceLogger(
        `Device disconnected: ${event.port.name} (${event.port.id})`
      );
      removeInput(event.port.id);
    }
  });
}
