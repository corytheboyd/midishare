import * as React from "react";
import { useStore } from "../../../lib/store";
import { useCallback } from "react";
import { Widget } from "./Widget";
import {
  StatusIndicator,
  StatusIndicatorColor,
} from "../../common/StatusIndicator";

const BPM: React.FC = () => {
  const activeInputId = useStore((state) => state.activeInputId);
  const bpm = useStore(
    useCallback((state) => state.timingClock[activeInputId].bpm, [
      activeInputId,
    ])
  );
  if (!bpm) {
    return <span className="text-gray-400">Waiting for data...</span>;
  }
  return (
    <span className="space-x-1.5">
      <span className="font-bold">{bpm}</span>
      <span>BPM</span>
    </span>
  );
};

export const TimingClock: React.FC = () => {
  const activeInputId = useStore((state) => state.activeInputId);

  const timingClockActive = useStore(
    useCallback((state) => state.timingClock[activeInputId]?.active, [
      activeInputId,
    ])
  );

  let indicatorColor: StatusIndicatorColor;
  if (timingClockActive === undefined) {
    indicatorColor = "gray";
  } else if (timingClockActive === false) {
    indicatorColor = "red";
  } else {
    indicatorColor = "green";
  }

  return (
    <Widget
      title={
        <div className="flex items-center space-x-2">
          <span>Timing Clock</span>
          <StatusIndicator color={indicatorColor} size="xs" />
        </div>
      }
    >
      {!timingClockActive && <div className="text-gray-400">N/A</div>}
      {timingClockActive && <BPM />}
    </Widget>
  );
};
