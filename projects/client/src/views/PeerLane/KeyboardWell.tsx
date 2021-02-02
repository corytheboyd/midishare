import React, { useMemo } from "react";
import { PeerLaneProps } from "./index";
import { Keyboard } from "@midishare/keyboard";

export const KeyboardWell: React.FC<PeerLaneProps> = (props) => {
  const keys = props.runtime.useStore((state) => state.keys);
  const keyboardActive = useMemo(() => keys.some((i) => i > 0), [keys]);

  const containerClassNames: string[] = "flex-auto p-3 flex flex-col justify-center rounded-2xl shadow-inner transition inset-5".split(
    " "
  );
  const keyboardClassNames: string[] = [];
  const bg = (weight: number) => `bg-${props.color}-${weight}`;

  if (props.keyboardDisabled) {
    keyboardClassNames.push("opacity-20");
  }

  if (keyboardActive) {
    containerClassNames.push(bg(100));
  } else {
    containerClassNames.push(bg(50));
  }

  return (
    <div className={containerClassNames.join(" ")}>
      {props.keyboardDisabled && props.disabledMessageContent && (
        <div className="bg-black text-white absolute self-center px-2 py-1 rounded z-10">
          {props.disabledMessageContent}
        </div>
      )}
      <div className={keyboardClassNames.join(" ")}>
        <Keyboard runtime={props.runtime} />
      </div>
    </div>
  );
};
