import React, { useMemo } from "react";
import { PeerLaneProps } from "./index";
import { Keyboard } from "@midishare/keyboard";
import classnames from "classnames";

export const KeyboardWell: React.FC<PeerLaneProps> = (props) => {
  const keys = props.runtime.useStore((state) => state.keys);
  const keyboardActive = useMemo(() => keys.some((i) => i > 0), [keys]);

  return (
    <div className="bg-gray-800 flex-auto p-5 flex flex-col justify-center rounded-2xl shadow-inner transition inset-5">
      {props.keyboardDisabled && props.disabledMessageContent && (
        <div className="bg-black opacity-80 text-white absolute self-center px-2 py-1 rounded z-10">
          {props.disabledMessageContent}
        </div>
      )}
      <div
        className={classnames({
          "opacity-50": props.keyboardDisabled,
        })}
      >
        <Keyboard runtime={props.runtime} />
      </div>
    </div>
  );
};
