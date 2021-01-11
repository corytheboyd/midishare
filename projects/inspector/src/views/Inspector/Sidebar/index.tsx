import * as React from "react";
import { useState } from "react";
import { Icon } from "../../common/Icon";
import { InputSelect } from "./InputSelect";

export const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <section
      id="sidebar"
      className="h-full bg-gray-600 text-gray-200 transition-all w-64"
    >
      <section
        id="sidebar-header"
        className="bg-gray-700 w-full px-2 py-2 flex flex-row items-center justify-end"
      >
        <button>
          <Icon name="chevron-double-left" size="sm" />
        </button>
      </section>

      <section id="sidebar-content" className="px-2 py-2">
        <label htmlFor="inputId">
          <div className="mb-1">
            <div className="text-sm font-bold">MIDI Device</div>
            <div className="ml-1 text-xs font-thin">
              Filter messages to those received from this MIDI device.
            </div>
          </div>
          <InputSelect name="inputId" id="inputId" />
        </label>
      </section>
    </section>
  );
};
