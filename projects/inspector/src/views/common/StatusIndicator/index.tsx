import * as React from "react";

type StatusIndicatorProps = {
  active: boolean;
  color: "red";
  size: "xs";
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = (props) => {
  const circleStyles = ["rounded-full"];

  switch (props.color) {
    case "red": {
      circleStyles.push(`bg-red-${props.active ? 500 : 800}`);
      break;
    }
  }

  switch (props.size) {
    case "xs": {
      circleStyles.push("h-2", "w-2");
      break;
    }
  }

  if (props.active) {
    circleStyles.push("animate-pulse");
  }

  return <div className={circleStyles.join(" ")} />;
};
