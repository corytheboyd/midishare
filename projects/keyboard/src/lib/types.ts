import { MutableRefObject } from "react";
import { Runtime } from "./Runtime";

export type KeyboardState = {
  /**
   * Request render in the case that we are not running in a game loop.
   * */
  needRender: boolean;

  /**
   * State of each key on they keyboard. Indexed based off of 88 key keyboard
   * starting at A0
   *
   * TODO this would work theorertically with a Uint8Array. But zustand
   *  doesn't detect change on Uint8Array unfortunately... maybe time for a
   *  PR? :)
   * */
  keys: number[];

  /**
   * Current state of the sustain pedal (true => depressed)
   * */
  sustain: boolean;

  /**
   * Engage sustain pedal
   * */
  sustainOn: () => void;

  /**
   * Release sustain pedal
   * */
  sustainOff: () => void;

  /**
   * Begin playing at key with the specified force
   * */
  keyOn: (name: KeyName, velocity: number) => void;

  /**
   * Remove force from the key
   * */
  keyOff: (name: KeyName) => void;
};

export type NoteName =
  | "A"
  | "AsBb"
  | "B"
  | "C"
  | "CsDb"
  | "D"
  | "DsEb"
  | "E"
  | "F"
  | "FsGb"
  | "G"
  | "GsAb";

export type KeyName =
  | "A0"
  | "AsBb0"
  | "B0"
  | "C1"
  | "CsDb1"
  | "D1"
  | "DsEb1"
  | "E1"
  | "F1"
  | "FsGb1"
  | "G1"
  | "GsAb1"
  | "A1"
  | "AsBb1"
  | "B1"
  | "C2"
  | "CsDb2"
  | "D2"
  | "DsEb2"
  | "E2"
  | "F2"
  | "FsGb2"
  | "G2"
  | "GsAb2"
  | "A2"
  | "AsBb2"
  | "B2"
  | "C3"
  | "CsDb3"
  | "D3"
  | "DsEb3"
  | "E3"
  | "F3"
  | "FsGb3"
  | "G3"
  | "GsAb3"
  | "A3"
  | "AsBb3"
  | "B3"
  | "C4"
  | "CsDb4"
  | "D4"
  | "DsEb4"
  | "E4"
  | "F4"
  | "FsGb4"
  | "G4"
  | "GsAb4"
  | "A4"
  | "AsBb4"
  | "B4"
  | "C5"
  | "CsDb5"
  | "D5"
  | "DsEb5"
  | "E5"
  | "F5"
  | "FsGb5"
  | "G5"
  | "GsAb5"
  | "A5"
  | "AsBb5"
  | "B5"
  | "C6"
  | "CsDb6"
  | "D6"
  | "DsEb6"
  | "E6"
  | "F6"
  | "FsGb6"
  | "G6"
  | "GsAb6"
  | "A6"
  | "AsBb6"
  | "B6"
  | "C7"
  | "CsDb7"
  | "D7"
  | "DsEb7"
  | "E7"
  | "F7"
  | "FsGb7"
  | "G7"
  | "GsAb7"
  | "A7"
  | "AsBb7"
  | "B7"
  | "C8";
