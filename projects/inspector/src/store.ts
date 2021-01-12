import create from "zustand/vanilla";
import createReactHook from "zustand";
import { Input, InputEventBase, InputEvents } from "webmidi";
import produce from "immer";

export type DeviceId = string;

export type FilterState = {
  /**
   * Mapping of WebMidi event types to boolean, for showing/hiding events of
   * given types.
   * */
  eventType: { [T in keyof InputEvents]: boolean };
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
  events: Record<DeviceId, InputEventBase<keyof InputEvents>[]>;

  addEvent: (
    deviceId: DeviceId,
    event: InputEventBase<keyof InputEvents>
  ) => void;

  /**
   * The filters applied to the events in view. Filters are unique to the
   * device to allow inspection for more than one MIDI device at a time.
   * */
  filter: Record<DeviceId, FilterState>;

  updateFilter: (deviceId: DeviceId, partial: Partial<FilterState>) => void;
};

export const store = create<InspectorState>((set, get) => {
  return {
    ready: false,
    inputs: {},
    activeInputId: undefined,
    events: {},
    filter: {},

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

          // if (!state.filter)
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

    updateFilter: (deviceId, partial) =>
      set(
        produce(get(), (state) => {
          state.filter[deviceId] = { ...state.filter[deviceId], ...partial };
        })
      ),
  };
});

export const useStore = createReactHook(store);
