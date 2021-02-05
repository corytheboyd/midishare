import React from "react";
import { ExclamationCircle } from "./icons/sm/ExclamationCircle";

export const InlineErrorMessage: React.FC<{ message: string }> = (props) => {
  return (
    <div className="text-red-500">
      <div className="flex space-x-2 items-center">
        <div className="w-5 h-5">
          <ExclamationCircle />
        </div>
        <p className="text-sm">{props.message}</p>
      </div>
    </div>
  );
};
