import { KeyName, NoteName } from "../../types";
import { noteNameRelativePositionMap } from "./common";

export function getIndexFromKeyName(keyName: KeyName): number {
  const octave = parseInt(keyName[keyName.length - 1], 10);

  let note: NoteName;
  if (keyName.length === 2) {
    note = keyName[0] as NoteName;
  } else {
    note = keyName.substr(0, 4) as NoteName;
  }

  // Offset such that A0 is index 0, C1 is index 3, etc.
  return (
    noteNameRelativePositionMap[note] +
    octave * 12 -
    noteNameRelativePositionMap.A
  );
}
