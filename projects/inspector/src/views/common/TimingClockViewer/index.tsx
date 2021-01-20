import * as React from "react";
import { StatusIndicator } from "../StatusIndicator";

export const TimingClockViewer: React.FC = () => {
  return (
    <div className="bg-gray-300 text-gray-800 text-xs h-full w-full flex flex-col flex flex-col rounded">
      <section className="text-center bg-gray-400 text-gray-600 font-bold py-0.5 px-2.5 rounded-t">
        <div>Timing Clock</div>
      </section>

      <section className="p-1">
        <div className="flex items-center space-x-1">
          <label className="font-bold mr-1">Status:</label>
          <StatusIndicator color="green" size="xs" />
        </div>
        <label className="font-bold mr-1">BPM:</label>
        <span>120</span>
      </section>
    </div>
  );
};
