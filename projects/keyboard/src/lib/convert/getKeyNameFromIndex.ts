import { KeyName, NoteName } from "../../types";
import { noteNameRelativePositionMap } from "./common";

export function getKeyNameFromIndex(index: number): KeyName {
  const octave = Math.floor((index + noteNameRelativePositionMap.A) / 12);
  let noteName: NoteName;
  switch (index % 12) {
    case 0:
      noteName = "A";
      break;
    case 1:
      noteName = "AsBb";
      break;
    case 2:
      noteName = "B";
      break;
    case 3:
      noteName = "C";
      break;
    case 4:
      noteName = "CsDb";
      break;
    case 5:
      noteName = "D";
      break;
    case 6:
      noteName = "DsEb";
      break;
    case 7:
      noteName = "E";
      break;
    case 8:
      noteName = "F";
      break;
    case 9:
      noteName = "FsGb";
      break;
    case 10:
      noteName = "G";
      break;
    case 11:
      noteName = "GsAb";
      break;
  }
  return (noteName + octave) as KeyName;
}
