import create from "zustand/vanilla";
import createReactHook from "zustand";
import { Input, InputEventBase, InputEvents } from "webmidi";
import produce from "immer";
import {
  createMidiMessageFromEvent,
  MidiMessage,
  MidiMessageType,
} from "./createMidiMessageFromEvent";

export type DeviceId = string;

export type FilterState = {
  /**
   * Mapping of WebMidi event types to boolean, for showing/hiding events of
   * given types.
   * */
  eventType: Partial<Record<MidiMessageType, boolean>>;
};

export type TimingClockState = {
  /**
   * Initially undefined. For MIDI controllers that do not emit timing clock
   * events, this will remain undefined. For controllers that do emit timing
   * clock events, this will be set to true while events are being received,
   * and set to false if events stop being sent.
   * */
  active?: boolean;

  /**
   * Calculated BPM value based off of incoming clock events. This value is
   * not updated in real-time to avoid unnecessary computation, but it's close
   * enough so that you won't notice.
   * */
  bpm?: number;
};

export type MidiDataNumericalFormat = "decimal" | "binary";

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
  events: Record<DeviceId, MidiMessage[]>;

  /**
   * Tracks count of events by type and input device
   * */
  eventsCount: Record<DeviceId, Partial<Record<keyof InputEvents, number>>>;

  incrementEventsCount: (
    deviceId: DeviceId,
    eventType: MidiMessageType
  ) => void;

  addEvents: (deviceId: DeviceId, events: MidiMessage[]) => void;

  /**
   * The filters applied to the events in view. Filters are unique to the
   * device to allow inspection for more than one MIDI device at a time.
   * */
  filter: Record<DeviceId, FilterState>;

  /**
   * Update the value of an eventType filter.
   * */
  setEventTypeFilter: (
    deviceId: DeviceId,
    eventType: MidiMessageType,
    value: boolean
  ) => void;

  /**
   * Format in which to display MIDI message data.
   * */
  numericalFormat: MidiDataNumericalFormat;

  setNumericalFormat: (format: MidiDataNumericalFormat) => void;

  /**
   * For devices that implement timing clock emission, this state captures the
   * raw input and turns it into useful information for this application.
   *
   * Unique to each device.
   *
   * The values stored in this typed array are high resolution timestamps, not
   * absolute times. These values are sourced from the timestamp value on the
   * underlying clock sync MIDI messages.
   * */
  timingClock: Record<DeviceId, TimingClockState>;

  updateTimingClockState: (
    deviceId: DeviceId,
    state: Partial<TimingClockState>
  ) => void;
  resetTimingClockState: (deviceId: DeviceId) => void;
};

export const store = create<InspectorState>((set, get) => {
  return {
    ready: false,
    inputs: {},
    activeInputId: undefined,
    events: {},
    eventsCount: {},
    filter: {},
    numericalFormat: "binary",
    timingClock: {},

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

          if (!state.timingClock[input.id]) {
            state.timingClock[input.id] = {};
          }

          if (!state.filter[input.id]) {
            state.filter[input.id] = {
              eventType: {},
            };

            // Set sensible filter defaults. This might be a roundabout place to
            // do it, but we can revisit later.
            state.filter[input.id].eventType[MidiMessageType.noteon] = true;
            state.filter[input.id].eventType[MidiMessageType.noteoff] = true;
            state.filter[input.id].eventType[
              MidiMessageType.controlchange
            ] = true;
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

    setEventTypeFilter: (deviceId, eventType, value) =>
      set(
        produce(get(), (state) => {
          state.filter[deviceId].eventType[eventType] = value;
        })
      ),

    setNumericalFormat: (format) =>
      set(
        produce(get(), (state) => {
          state.numericalFormat = format;
        })
      ),

    updateTimingClockState: (deviceId, partial) =>
      set(
        produce(get(), (state) => {
          state.timingClock[deviceId] = {
            ...state.timingClock[deviceId],
            ...partial,
          };
        })
      ),

    resetTimingClockState: (deviceId) =>
      set(
        produce(get(), (state) => {
          state.timingClock[deviceId] = {};
        })
      ),
  };
});

export const useStore = createReactHook(store);
