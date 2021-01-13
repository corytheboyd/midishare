import { Input, InputEventBase, InputEvents } from "webmidi";
import { store } from "../store";

export function createInputListeners(input: Input): void {
  // TODO not on ALL midi channels?
  input.addListener("activesensing", "all", inputEventHandler);
  input.addListener("channelaftertouch", "all", inputEventHandler);
  input.addListener("channelmode", "all", inputEventHandler);
  input.addListener("clock", "all", inputEventHandler);
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
}

function inputEventHandler(event: InputEventBase<keyof InputEvents>): void {
  const { addEvent } = store.getState();
  addEvent(event.target.id, event);
}
