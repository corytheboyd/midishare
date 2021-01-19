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

  /**
   * Tracks count of events by type and input device
   * */
  eventsCount: Record<DeviceId, Partial<Record<keyof InputEvents, number>>>;

  incrementEventsCount: (
    deviceId: DeviceId,
    eventType: keyof InputEvents
  ) => void;

  addEvents: (
    deviceId: DeviceId,
    events: InputEventBase<keyof InputEvents>[]
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
    eventsCount: {},
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

          if (!state.eventsCount[input.id]) {
            state.eventsCount[input.id] = {};
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

    incrementEventsCount: (deviceId, eventType) =>
      set(
        produce(get(), (state) => {
          if (!state.eventsCount[deviceId][eventType]) {
            state.eventsCount[deviceId][eventType] = 1;
          } else {
            state.eventsCount[deviceId][eventType] += 1;
          }
        })
      ),

    addEvents: (deviceId, events) =>
      set(
        produce(get(), (state) => {
          state.events[deviceId] = state.events[deviceId].concat(events);
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
