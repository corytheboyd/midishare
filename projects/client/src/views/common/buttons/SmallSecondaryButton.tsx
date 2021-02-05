import { BaseButton } from "./BaseButton";
import React from "react";

type SmallSecondaryButtonProps = {
  color: "green" | "red";
};

export const SmallSecondaryButton: React.FC<SmallSecondaryButtonProps> = (
  props
) => {
  return (
    <BaseButton
      className={`border-${props.color}-300 bg-${props.color}-50 text-${props.color}-500 border-2 rounded px-2 py-0.5`}
    >
      {props.children}
    </BaseButton>
  );
};
