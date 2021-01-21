import * as React from "react";
import { StatusIndicator, StatusIndicatorColor } from "../StatusIndicator";
import { useStore } from "../../../lib/store";
import { useCallback } from "react";

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

export const TimingClockViewer: React.FC = () => {
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
    <div className="bg-gray-300 text-gray-800 text-xs h-full w-full flex flex-col flex flex-col rounded">
      <section className="text-center bg-gray-400 text-gray-600 font-bold py-0.5 px-2.5 rounded-t">
        <div className="flex items-center space-x-2">
          <span>Timing Clock</span>
          <StatusIndicator color={indicatorColor} size="xs" />
        </div>
      </section>

      <section className="p-1 flex flex-col items-center justify-center text-xs">
        {!timingClockActive && <div className="text-gray-400">N/A</div>}
        {timingClockActive && <BPM />}
      </section>
    </div>
  );
};
