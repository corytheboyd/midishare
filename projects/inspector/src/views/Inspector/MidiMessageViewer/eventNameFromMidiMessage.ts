import {
  MidiMessage,
  MidiMessageType,
} from "../../../lib/createMidiMessageFromEvent";
import { InputEvents } from "webmidi";

export function eventNameFromMidiMessage(
  eventType: MidiMessageType
): keyof InputEvents {
  switch (eventType) {
    case MidiMessageType.activesensing: {
      return "activesensing";
    }
    case MidiMessageType.channelaftertouch: {
      return "channelaftertouch";
    }
    case MidiMessageType.channelmode: {
      return "channelmode";
    }
    case MidiMessageType.clock: {
      return "clock";
    }
    case MidiMessageType.continue: {
      return "continue";
    }
    case MidiMessageType.controlchange: {
      return "controlchange";
    }
    case MidiMessageType.keyaftertouch: {
      return "keyaftertouch";
    }
    case MidiMessageType.noteoff: {
      return "noteoff";
    }
    case MidiMessageType.noteon: {
      return "noteon";
    }
    case MidiMessageType.pitchbend: {
      return "pitchbend";
    }
    case MidiMessageType.programchange: {
      return "programchange";
    }
    case MidiMessageType.reset: {
      return "reset";
    }
    case MidiMessageType.songposition: {
      return "songposition";
    }
    case MidiMessageType.songselect: {
      return "songselect";
    }
    case MidiMessageType.start: {
      return "start";
    }
    case MidiMessageType.stop: {
      return "stop";
    }
    case MidiMessageType.sysex: {
      return "sysex";
    }
    case MidiMessageType.timecode: {
      return "tuningrequest";
    }
    case MidiMessageType.tuningrequest: {
      return "tuningrequest";
    }
    case MidiMessageType.unknownsystemmessage: {
      return "unknownsystemmessage";
    }
  }
}
