import WebMidi from "webmidi";
import { deviceLogger } from "./debug";
import { removeInput } from "./removeInput";
import { addInput } from "./addInput";

export function createDeviceListeners(): void {
  WebMidi.addListener("connected", (event) => {
    if (event.port.type === "input") {
      deviceLogger(
        `device connected: name: ${event.port.name} id: ${event.port.id}`
      );
      addInput(event.port);
    }
  });

  WebMidi.addListener("disconnected", (event) => {
    if (event.port.type === "input") {
      deviceLogger(`device disconnected: id: ${event.port.id}`);
      removeInput(event.port.id);
    }
  });
}
