import React from "react";
import { BaseButton, BaseButtonProps } from "./BaseButton";

export const LargePrimaryButton: React.FC<BaseButtonProps> = (props) => {
  return (
    <BaseButton
      className="flex w-48 items-center justify-center space-x-1 px-2 py-1 rounded text-white bg-green-500 transition hover:shadow-md"
      {...props}
    />
  );
};
