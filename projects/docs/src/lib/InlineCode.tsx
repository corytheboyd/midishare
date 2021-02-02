import * as React from "react";

export const InlineCode: React.FC = (props) => (
  <span className="font-mono font-bold text-purple-700">
    `{props.children}`
  </span>
);
