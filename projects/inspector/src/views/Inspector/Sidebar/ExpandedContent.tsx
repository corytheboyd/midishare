import * as React from "react";
import { InputSelect } from "./InputSelect";
import { Icon } from "../../common/Icon";

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
              <span className="text-sm">Active Sensing</span>
              <Icon name="question-mark-circle" size="xs" />
            </div>
          </label>
        </label>
      </div>
    </div>
  );
};
