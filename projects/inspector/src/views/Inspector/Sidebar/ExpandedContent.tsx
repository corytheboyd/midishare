import * as React from "react";
import { Icon } from "../../common/Icon";
import { InputSelect } from "./InputSelect";

export const ExpandedContent: React.FC = () => {
  return (
    <>
      <label htmlFor="inputId">
        <div className="mb-1">
          <div className="text-sm font-bold">MIDI Device</div>
          <div className="ml-1 text-xs font-thin">
            Filter messages to those received from this MIDI device.
          </div>
        </div>
        <InputSelect name="inputId" id="inputId" />
      </label>
    </>
  );
};
