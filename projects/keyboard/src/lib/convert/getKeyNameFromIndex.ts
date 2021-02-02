import { noteNameRelativePositionMap } from "./common";
import { KeyName } from "../types";

export function getKeyNameFromIndex(index: number): KeyName {
  const octave = Math.floor((index + noteNameRelativePositionMap.A) / 12);
  switch (index % 12) {
    case 0:
      return `A${octave}` as KeyName;
    case 1:
      return `AsBb${octave}` as KeyName;
    case 2:
      return `B${octave}` as KeyName;
    case 3:
      return `C${octave}` as KeyName;
    case 4:
      return `CsDb${octave}` as KeyName;
    case 5:
      return `D${octave}` as KeyName;
    case 6:
      return `DsEb${octave}` as KeyName;
    case 7:
      return `E${octave}` as KeyName;
    case 8:
      return `F${octave}` as KeyName;
    case 9:
      return `FsGb${octave}` as KeyName;
    case 10:
      return `G${octave}` as KeyName;
    case 11:
      return `GsAb${octave}` as KeyName;
    default:
      throw new Error("This should never happen");
  }
}
