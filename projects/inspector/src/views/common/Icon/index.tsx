import * as React from "react";
import * as SmIcons from "./sm";
import * as MdIcons from "./md";

type IconProps = {
  className?: string;

  /**
   * Canonical icon size
   * */
  size: "xs" | "sm" | "md";

  /**
   * Canonical icon name
   * */
  name:
    | "x"
    | "pause"
    | "play"
    | "chevron-double-left"
    | "chevron-double-right"
    | "question-mark-circle";
};

const MissingIcon: React.FC<{ name: string }> = ({ name }) => (
  <span className="font-mono text-xs">[{name}]</span>
);

const boxSizePxMap = {
  md: 24,
  sm: 20,
  xs: 16,
};

export const Icon: React.FC<IconProps> = (props) => {
  const boxSizePx = boxSizePxMap[props.size];
  const normalizedIconName = props.name
    .split("-")
    .map((s) => s[0].toUpperCase() + s.substr(1))
    .join("");
  const icon = (props.size === "md" ? MdIcons : SmIcons)[normalizedIconName];
  if (!icon) {
    console.error(
      `Missing icon! name=${props.name} normalizedIconName=${normalizedIconName} size=${props.size}`
    );
  }
  return (
    <div
      style={{ width: boxSizePx, height: boxSizePx }}
      className={props.className || ""}
    >
      {icon || <MissingIcon name={props.name} />}
    </div>
  );
};
