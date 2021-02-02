import React, { useMemo } from "react";
import { Keyboard, Runtime } from "@midishare/keyboard";

type PeerLaneProps = {
  runtime: Runtime;
  color: "green" | "purple" | "red" | "blue" | "yellow";
  keyboardDisabled?: boolean;
  disabledMessageContent?: JSX.Element;
};

const KeyboardWell: React.FC<PeerLaneProps> = (props) => {
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

const VideoWell: React.FC<PeerLaneProps> = (props) => {
  return (
    <div className="flex-auto flex flex-col justify-center items-center shadow-md">
      <div className="w-full flex-auto bg-gray-800 rounded-t"></div>
      <div className="w-full h-7 flex-grow-0 bg-gray-500 rounded-b"></div>
    </div>
  );
};

export const PeerLane: React.FC<PeerLaneProps> = (props) => {
  return (
    <div className="w-full h-full flex space-x-2">
      <KeyboardWell {...props} />
      <div className="w-80 flex-grow-0 flex flex-col space-y-2">
        <VideoWell {...props} />
        <div className="flex-auto flex justify-center items-center">
          <span>stats and stuff</span>
        </div>
      </div>
    </div>
  );
};
