import { Input, InputEventBase, InputEventClock, InputEvents } from "webmidi";
import { DeviceId, store } from "./store";
import { deviceLogger } from "./debug";

const EVENTS_BUFFER_SIZE = 10;
const EVENTS_BUFFER_FLUSH_TIMEOUT_MS = 50;
const TIMING_CLOCK_BUFFER_SIZE = 150;
const TIMING_CLOCK_TIMEOUT_DURATION_MS = 500;
const TIMING_CLOCK_BPM_UPDATE_RATE_PULSES = 5;

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
  {
    pulseCount: number;
    lastPulseAt?: number;
    pulseTimeDiffs?: number[];
  }
> = {};

function inputEventHandler(event: InputEventBase<keyof InputEvents>): void {
  const deviceId = event.target.id;

  store.getState().incrementEventsCount(deviceId, event.type);

  if (event.type === "clock") {
    processTimingClockEvent(event as InputEventClock);
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

const timingClockAliveTimeoutMap: Record<DeviceId, NodeJS.Timeout> = {};

function processTimingClockEvent(event: InputEventClock): void {
  const deviceId = event.target.id;

  if (store.getState().timingClock[deviceId].active === undefined) {
    deviceLogger(`Timing clock detected for device: ${deviceId}`);
    store.getState().updateTimingClockState(deviceId, { active: true });
  } else if (timingClockAliveTimeoutMap[deviceId]) {
    clearTimeout(timingClockAliveTimeoutMap[deviceId]);
    timingClockAliveTimeoutMap[deviceId] = setTimeout(() => {
      store.getState().updateTimingClockState(deviceId, { active: false });
    }, TIMING_CLOCK_TIMEOUT_DURATION_MS);
  }

  if (!timingClockStateMap[deviceId]) {
    timingClockStateMap[deviceId] = {
      pulseCount: 0,
      lastPulseAt: event.timestamp,
      pulseTimeDiffs: [],
    };
    return;
  }

  if (
    timingClockStateMap[deviceId].pulseTimeDiffs.length ===
    TIMING_CLOCK_BUFFER_SIZE
  ) {
    timingClockStateMap[deviceId].pulseTimeDiffs.shift();
  }

  const timeDiff = event.timestamp - timingClockStateMap[deviceId].lastPulseAt;
  timingClockStateMap[deviceId].lastPulseAt = event.timestamp;
  timingClockStateMap[deviceId].pulseTimeDiffs.push(timeDiff);

  if (
    timingClockStateMap[deviceId].pulseTimeDiffs.length ===
    TIMING_CLOCK_BUFFER_SIZE
  ) {
    const numerator = timingClockStateMap[deviceId].pulseTimeDiffs.reduce(
      (x, r) => (r += x),
      0
    );
    const average = numerator / TIMING_CLOCK_BUFFER_SIZE;
    const bpm = Math.ceil((1000 * 60) / (average * 24));

    if (
      timingClockStateMap[deviceId].pulseCount === 0 ||
      timingClockStateMap[deviceId].pulseCount %
        TIMING_CLOCK_BPM_UPDATE_RATE_PULSES ===
        0
    ) {
      store.getState().updateTimingClockState(deviceId, { bpm: bpm });
    }
  }

  timingClockStateMap[deviceId].pulseCount += 1;
}
