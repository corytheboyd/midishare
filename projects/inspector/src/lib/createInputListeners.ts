import {
  Input,
  InputEventActivesensing,
  InputEventBase,
  InputEventClock,
  InputEvents,
} from "webmidi";
import { addEventForInput } from "./addEventForInput";
import { DeviceId } from "../store";

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

  input.addListener("activesensing", "all", activeSensingEventHandler);
  input.addListener("clock", "all", inputClockEventHandler);
}

function inputEventHandler(event: InputEventBase<keyof InputEvents>): void {
  addEventForInput(event.target.id, event);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function activeSensingEventHandler(_event: InputEventActivesensing) {
  // TODO this one isn't really that useful in the web, where we have a higher
  //  level API for device connection management, but that won't be the case in
  //  other environments.
}

const midiClockRef: Record<DeviceId, number> = {};
function inputClockEventHandler(event: InputEventClock) {
  if (!midiClockRef[event.target.id]) {
    midiClockRef[event.target.id] = 0;
  }

  midiClockRef[event.target.id] += 1;

  if (midiClockRef[event.target.id] === 24) {
    midiClockRef[event.target.id] = 0;
    console.debug("QUARTER NOTE", event.target.name);
  }
}
