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
  name: "x";
};

export const Icon: React.FC<IconProps> = (props) => {
  const boxSizePx = props.size === "sm" ? 20 : 24;
  const normalizedIconName = props.name
    .split("-")
    .map((s) => s[0].toUpperCase())
    .join();
  const icon = (props.size === "sm" ? SmIcons : MdIcons)[normalizedIconName];
  return <div style={{ width: boxSizePx, height: boxSizePx }}>{icon}</div>;
};
