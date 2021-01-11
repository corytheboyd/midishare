import * as React from "react";
import * as SmIcons from "./sm";
import * as MdIcons from "./md";

type IconProps = {
  /**
   * Canonical icon size
   * */
  size: "sm" | "md";

  /**
   * Canonical icon name
   * */
  name: "x" | "chevron-double-left" | "chevron-double-right";
};

const MissingIcon: React.FC<{ name: string }> = ({ name }) => (
  <span className="font-mono text-xs">[{name}]</span>
);

export const Icon: React.FC<IconProps> = (props) => {
  const boxSizePx = props.size === "sm" ? 20 : 24;
  const normalizedIconName = props.name
    .split("-")
    .map((s) => s[0].toUpperCase() + s.substr(1))
    .join("");
  const icon = (props.size === "sm" ? SmIcons : MdIcons)[normalizedIconName];
  if (!icon) {
    console.error(
      `Missing icon! name=${props.name} normalizedIconName=${normalizedIconName} size=${props.size}`
    );
  }
  return (
    <div style={{ width: boxSizePx, height: boxSizePx }}>
      {icon || <MissingIcon name={props.name} />}
    </div>
  );
};
