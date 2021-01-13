import * as React from "react";
import { useState } from "react";
import { Icon } from "../../common/Icon";
import { CollapsedContent } from "./CollapsedContent";
import { ExpandedContent } from "./ExpandedContent";

export const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(true);

  // See: https://tailwindcss.com/docs/width
  const widthClassName = "w-80";

  return (
    <section
      id="sidebar"
      className={`h-full bg-gray-600 text-gray-200 transition-all ${
        expanded ? widthClassName : ""
      }`}
    >
      <section
        id="sidebar-header"
        className="bg-gray-700 w-full px-2 py-2 flex flex-row items-center justify-end"
      >
        <button onClick={() => setExpanded(!expanded)}>
          <Icon
            name={expanded ? "chevron-double-left" : "chevron-double-right"}
            size="sm"
          />
        </button>
      </section>

      <section id="sidebar-content" className="px-2 py-2">
        {expanded ? <ExpandedContent /> : <CollapsedContent />}
      </section>
    </section>
  );
};
