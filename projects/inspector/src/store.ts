import create from "zustand/vanilla";
import createReactHook from "zustand";
import { Input, InputEventBase, InputEvents } from "webmidi";
import produce from "immer";

export type DeviceId = string;

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
  events: Record<DeviceId, InputEventBase<keyof InputEvents>[]>;

  addEvent: (
    deviceId: DeviceId,
    event: InputEventBase<keyof InputEvents>
  ) => void;
};

export const store = create<InspectorState>((set, get) => {
  return {
    ready: false,
    inputs: {},
    activeInputId: undefined,
    events: {},

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

          if (!state.events[input.id]) {
            state.events[input.id] = [];
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

    addEvent: (deviceId, event) =>
      set(
        produce(get(), (state) => {
          state.events[deviceId].push(event);
        })
      ),
  };
});

export const useStore = createReactHook(store);
