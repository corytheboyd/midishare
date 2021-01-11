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
   * Set to true after successfully getting MIDI device access
   * */
  ready: boolean;
  makeReady: () => void;

  /**
   * MIDI input devices are synced to this state
   * */
  inputs: Input[];

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
    ready: false,
    inputs: [],
    messages: {},

    makeReady: () =>
      set(
        produce(get(), (state) => {
          state.ready = true;
        })
      ),

    addInput: (input) =>
      set(
        produce(get(), (state) => {
          state.inputs.push(input);
          if (!state.messages[input.id]) {
            state.messages[input.id] = [];
          }
        })
      ),

    removeInput: (id) =>
      set(
        produce(get(), (state) => {
          state.inputs = state.inputs.filter((input) => input.id !== id);
        })
      ),

    addMessage: (deviceId, message) =>
      set(
        produce(get(), (state) => {
          state.messages[deviceId].push(message);
        })
      ),
  };
});

store.subscribe(
  (inputs) => console.log("inputs", inputs),
  (state) => state.inputs
);

export const useStore = createReactHook(store);
