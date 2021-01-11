import create from "zustand/vanilla";
import createReactHook from "zustand";
import { Input } from "webmidi";
import produce from "immer";

export type DeviceId = string;

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
  inputs: Record<DeviceId, Input>;

  /**
   * The currently selected MIDI input device.
   * */
  activeInputId?: DeviceId;

  addInput: (input: Input) => void;

  removeInput: (id: DeviceId) => void;

  setActiveInput: (id: DeviceId) => void;

  /**
   * Events received from input devices, by device ID
   * */
  messages: Record<DeviceId, MidiMessage[]>;

  addMessage: (deviceId: DeviceId, message: MidiMessage) => void;
};

export const store = create<InspectorState>((set, get) => {
  return {
    ready: false,
    inputs: {},
    activeInputId: undefined,
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
          state.inputs[input.id] = input;

          if (!state.messages[input.id]) {
            state.messages[input.id] = [];
          }
        })
      ),

    removeInput: (id) =>
      set(
        produce(get(), (state) => {
          delete state.inputs[id];
        })
      ),

    setActiveInput: (id) =>
      set(
        produce(get(), (state) => {
          state.activeInputId = id;
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

export const useStore = createReactHook(store);
