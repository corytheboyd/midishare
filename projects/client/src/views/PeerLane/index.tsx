import React, { useCallback, useMemo } from "react";
import { Keyboard, Runtime } from "@midishare/keyboard";

type PeerLaneProps = {
  runtime: Runtime;
  color: "green" | "purple" | "red" | "blue" | "yellow";
  keyboardDisabled?: boolean;
};

const KeyboardWell: React.FC<PeerLaneProps> = (props) => {
  const keys = props.runtime.useStore((state) => state.keys);
  const keyboardActive = useMemo(() => keys.some((i) => i > 0), [keys]);

  const containerClassNames: string[] = "flex-auto p-3 flex flex-col justify-center rounded shadow-inner transition inset-5".split(
    " "
  );
  const keyboardClassNames: string[] = [];
  const bg = (weight: number) => `bg-${props.color}-${weight}`;

  if (props.keyboardDisabled) {
    keyboardClassNames.push("opacity-20");
    containerClassNames.push(bg(100));
  } else if (keyboardActive) {
    containerClassNames.push(bg(200));
  } else {
    containerClassNames.push(bg(100));
  }

  return (
    <div className={containerClassNames.join(" ")}>
      <div className={keyboardClassNames.join(" ")}>
        <Keyboard runtime={props.runtime} />
      </div>
    </div>
  );
};

export const PeerLane: React.FC<PeerLaneProps> = (props) => {
  return (
    <div className="w-full h-full flex space-x-2">
      <KeyboardWell {...props} />
      <div className="w-80 flex-grow-0 flex flex-col space-y-2">
        <div
          className={`flex-auto flex justify-center items-center rounded shadow-md bg-${props.color}-100`}
        >
          <span>VIDEO</span>
        </div>
        <div className="flex-auto flex justify-center items-center">
          <span>stats and stuff</span>
        </div>
      </div>
    </div>
  );
};
