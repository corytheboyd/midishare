import { InputEventBase, InputEvents } from "webmidi";

export enum MidiMessageType {
  channelaftertouch,
  channelmode,
  continue,
  controlchange,
  keyaftertouch,
  noteon,
  noteoff,
  pitchbend,
  programchange,
  reset,
  songposition,
  songselect,
  start,
  stop,
  sysex,
  timecode,
  tuningrequest,
  unknownsystemmessage,
  activesensing,
  clock,
}

export type MidiMessage = [
  type: MidiMessageType,
  timestamp: number,
  data: Uint8Array
];

const eventTypeToEnumValueMap: Partial<
  { [T in keyof InputEvents]: MidiMessageType }
> = {
  channelaftertouch: MidiMessageType.channelaftertouch,
  channelmode: MidiMessageType.channelmode,
  continue: MidiMessageType.continue,
  controlchange: MidiMessageType.controlchange,
  keyaftertouch: MidiMessageType.keyaftertouch,
  noteon: MidiMessageType.noteon,
  noteoff: MidiMessageType.noteoff,
  pitchbend: MidiMessageType.pitchbend,
  programchange: MidiMessageType.programchange,
  reset: MidiMessageType.reset,
  songposition: MidiMessageType.songposition,
  songselect: MidiMessageType.songselect,
  start: MidiMessageType.start,
  stop: MidiMessageType.stop,
  sysex: MidiMessageType.sysex,
  timecode: MidiMessageType.timecode,
  tuningrequest: MidiMessageType.tuningrequest,
  unknownsystemmessage: MidiMessageType.unknownsystemmessage,
  activesensing: MidiMessageType.activesensing,
  clock: MidiMessageType.clock,
};

export function createMidiMessageFromEvent(
  event: InputEventBase<keyof InputEvents>
): MidiMessage {
  return [eventTypeToEnumValueMap[event.type], event.timestamp, event.data];
}
