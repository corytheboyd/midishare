import * as React from "react";

type StatusIndicatorProps = {
  active?: boolean;
  color: "red" | "green";
  size: "xs";
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = (props) => {
  const circleStyles = ["rounded-full"];
  const active = props.active || true;

  switch (props.color) {
    case "red": {
      circleStyles.push(`bg-red-${active ? 500 : 800}`);
      break;
    }
    case "green": {
      circleStyles.push(`bg-green-${active ? 500 : 800}`);
      break;
    }
  }

  switch (props.size) {
    case "xs": {
      circleStyles.push("h-2", "w-2");
      break;
    }
  }

  return <div className={circleStyles.join(" ")} />;
};
