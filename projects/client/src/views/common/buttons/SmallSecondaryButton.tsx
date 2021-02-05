import { BaseButton, BaseButtonProps } from "./BaseButton";
import React from "react";

interface SmallSecondaryButtonProps extends BaseButtonProps {
  color: "green" | "red";
}

export const SmallSecondaryButton: React.FC<SmallSecondaryButtonProps> = ({
  color,
  ...props
}) => {
  return (
    <BaseButton
      className={`border-${color}-300 bg-${color}-50 text-${color}-500 border-2 rounded px-2 py-0.5 transition hover:shadow`}
      {...props}
    >
      {props.children}
    </BaseButton>
  );
};
