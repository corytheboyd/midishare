import { Input, InputEventBase, InputEvents } from "webmidi";
import { DeviceId, store } from "./store";

export function createInputListeners(input: Input): void {
  // TODO not on ALL midi channels?
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

function inputEventHandler(event: InputEventBase<keyof InputEvents>): void {
  const deviceId = event.target.id;

  store.getState().incrementEventsCount(deviceId, event.type);

  if (!inputEventBufferMap[deviceId]) {
    inputEventBufferMap[deviceId] = [];
  }
  inputEventBufferMap[deviceId].push(event);

  // Immediately flush if we reached the max buffer size
  if (inputEventBufferMap[deviceId].length === BUFFER_SIZE) {
    flushBufferedEvents(deviceId);
    return;
  }

  // Otherwise, poke the flush timer for the device
  if (inputEventTimeoutIdMap[deviceId]) {
    // deviceLogger("Poking input events buffer flush timeout");
    clearFlushTimeout(deviceId);
  } else {
    // deviceLogger("Start events buffer flush timeout");
  }
  inputEventTimeoutIdMap[deviceId] = setTimeout(
    () => flushBufferedEvents(deviceId),
    BUFFER_FLUSH_TIMEOUT_MS
  );
}

const inputEventBufferMap: Record<
  DeviceId,
  InputEventBase<keyof InputEvents>[]
> = {};
const inputEventTimeoutIdMap: Record<DeviceId, NodeJS.Timeout> = {};
const BUFFER_SIZE = 10;
const BUFFER_FLUSH_TIMEOUT_MS = 50;

function flushBufferedEvents(deviceId: DeviceId): void {
  // deviceLogger("Flushing buffered input events to store");

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
