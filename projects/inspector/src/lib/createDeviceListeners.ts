import { store } from "../store";
import WebMidi from "webmidi";
import { deviceLogger } from "./debug";

export async function createDeviceListeners(): Promise<void> {
  const addInput = store.getState().addInput;
  const removeInput = store.getState().removeInput;

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
