import create from "zustand/vanilla";
import createReactHook from "zustand";
import { Input } from "webmidi";
import produce from "immer";

type DeviceId = string;

type MidiMessage = {
  data: Uint8Array;
  timestamp: number;
};

type InspectorState = {
  /**
   * MIDI input devices are synced to this state
   * */
  inputs: Record<string, Input>;

  addInput: (input: Input) => void;

  removeInput: (id: DeviceId) => void;

  /**
   * Events received from input devices, by device ID
   * */
  messages: Record<DeviceId, MidiMessage[]>;

  addMessage: (deviceId: DeviceId, message: MidiMessage) => void;
};

export const store = create<InspectorState>((set, get) => {
  return {
    messages: {},
    inputs: {},

    addInput: (input) => {
      console.log("addInput()");
      return produce(get(), (state) => {
        console.log("addInput() IMMER");
        state.inputs[input.id] = input;

        if (!state.messages[input.id]) {
          console.log("addInput() INIT MESSAGES");
          state.messages[input.id] = [];
        } else {
          console.log("addInput() NO INIT");
        }
      });
    },

    removeInput: (id) => {
      console.log("removeInput()");
      return produce(get(), (state) => {
        console.log("removeInput() IMMER");
        delete state.inputs[id];
      });
    },

    addMessage: (deviceId, message) => {
      console.log("addMessage()");
      return produce(get(), (state) => {
        console.log("addMessage() IMMERS");
        state.messages[deviceId].push(message);
      });
    },
  };
});

store.subscribe(
  (inputs) => console.log("inputs", inputs),
  (state) => state.inputs
);

export const useStore = createReactHook(store);
