import { Input, InputEventBase, InputEvents } from "webmidi";
import { DeviceId, store } from "./store";

const EVENTS_BUFFER_SIZE = 10;
const EVENTS_BUFFER_FLUSH_TIMEOUT_MS = 50;

export function createInputListeners(input: Input): void {
  input.addListener("channelaftertouch", "all", inputEventHandler);
  input.addListener("channelmode", "all", inputEventHandler);
  input.addListener("continue", "all", inputEventHandler);
  input.addListener("controlchange", "all", inputEventHandler);
  input.addListener("keyaftertouch", "all", inputEventHandler);
  input.addListener("noteon", "all", inputEventHandler);
  input.addListener("noteoff", "all", inputEventHandler);
  input.addListener("pitchbend", "all", inputEventHandler);
  input.addListener("programchange", "all", inputEventHandler);
  input.addListener("reset", "all", inputEventHandler);
  input.addListener("songposition", "all", inputEventHandler);
  input.addListener("songselect", "all", inputEventHandler);
  input.addListener("start", "all", inputEventHandler);
  input.addListener("stop", "all", inputEventHandler);
  input.addListener("sysex", "all", inputEventHandler);
  input.addListener("timecode", "all", inputEventHandler);
  input.addListener("tuningrequest", "all", inputEventHandler);
  input.addListener("unknownsystemmessage", "all", inputEventHandler);
  input.addListener("activesensing", "all", inputEventHandler);
  input.addListener("clock", "all", inputEventHandler);
}

const timingClockStateMap: Record<
  DeviceId,
  { eventCount: number; lastQuarterNoteAt?: number }
> = {};

function inputEventHandler(event: InputEventBase<keyof InputEvents>): void {
  const deviceId = event.target.id;

  store.getState().incrementEventsCount(deviceId, event.type);

  if (event.type === "clock") {
    store.getState().addTimingClockEvent(deviceId, event.timestamp);

    // Initialize at 0 on the first message being received, though it's not
    // guarantee that our counting will be lined up with the internal clock.
    // In that, our concept of the quarter note starting count at zero won't
    // line up with the device's metronome "clicks". We can solve that later,
    // it would need some sort of interaction from the user to adjust an
    // offset.
    if (!timingClockStateMap[deviceId]) {
      timingClockStateMap[deviceId] = { eventCount: 1 };
    } else {
      timingClockStateMap[deviceId].eventCount += 1;
    }

    if (timingClockStateMap[deviceId].eventCount === 24) {
      if (timingClockStateMap[deviceId].lastQuarterNoteAt) {
        const diff =
          event.timestamp - timingClockStateMap[deviceId].lastQuarterNoteAt;
        const bpm = Math.round((1000 * 60) / diff);
        console.debug("QUARTER NOTE, TIME DIFF, BPM", diff, bpm);
      }

      timingClockStateMap[deviceId].eventCount = 0;
      timingClockStateMap[deviceId].lastQuarterNoteAt = event.timestamp;
    }
  }

  if (!inputEventBufferMap[deviceId]) {
    inputEventBufferMap[deviceId] = [];
  }
  inputEventBufferMap[deviceId].push(event);

  if (inputEventBufferMap[deviceId].length === EVENTS_BUFFER_SIZE) {
    flushBufferedEvents(deviceId);
    return;
  }

  if (inputEventTimeoutIdMap[deviceId]) {
    clearFlushTimeout(deviceId);
  }

  inputEventTimeoutIdMap[deviceId] = setTimeout(
    () => flushBufferedEvents(deviceId),
    EVENTS_BUFFER_FLUSH_TIMEOUT_MS
  );
}

const inputEventBufferMap: Record<
  DeviceId,
  InputEventBase<keyof InputEvents>[]
> = {};
const inputEventTimeoutIdMap: Record<DeviceId, NodeJS.Timeout> = {};

function flushBufferedEvents(deviceId: DeviceId): void {
  store.getState().addEvents(deviceId, inputEventBufferMap[deviceId]);

  // Reset buffer by mutating the length property of the Array
  inputEventBufferMap[deviceId].length = 0;

  clearFlushTimeout(deviceId);
}

function clearFlushTimeout(deviceId: DeviceId): void {
  if (inputEventTimeoutIdMap[deviceId]) {
    clearTimeout(inputEventTimeoutIdMap[deviceId]);
    delete inputEventTimeoutIdMap[deviceId];
  }
}
