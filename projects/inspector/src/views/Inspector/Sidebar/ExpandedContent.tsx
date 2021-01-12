import * as React from "react";
import { InputSelect } from "./InputSelect";

const CountBadge: React.FC<{ value: number }> = ({ value }) => {
  return (
    <span className="bg-gray-800 text-gray-200 text-xs font-bold px-1 py-0.5 rounded">
      {value <= 999 ? value : "999+"}
    </span>
  );
};

export const ExpandedContent: React.FC = () => {
  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="activeInputId">
          <div className="mb-1">
            <div className="text-sm font-bold">Device</div>
            <div className="ml-1 text-xs font-thin">
              Filter messages to those received from this MIDI device.
            </div>
          </div>
          <InputSelect name="activeInputId" id="activeInputId" />
        </label>
      </div>

      <div>
        <label>
          <div className="mb-1">
            <div className="text-sm font-bold">Events</div>
            <div className="ml-1 text-xs font-thin">
              Filter displayed events by type
            </div>
          </div>
          <label htmlFor="activeSensingEventFilter">
            <div className="flex items-center space-x-1">
              <input type="checkbox" id="activeSensingEventFilter" />
              <span className="text-sm">Active sensing</span>
              <CountBadge value={420} />
            </div>
          </label>
        </label>
      </div>
    </div>
  );
};
