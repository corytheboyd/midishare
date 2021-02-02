import React from "react";
import { Keyboard, Runtime } from "@midishare/keyboard";

type PeerLaneProps = {
  runtime: Runtime;
  color: "green" | "purple" | "red" | "blue" | "yellow";
  keyboardDisabled?: boolean;
  keyboardActive?: boolean;
};

const KeyboardWell: React.FC<PeerLaneProps> = (props) => {
  const classNames: string[] = "flex-auto p-3 flex flex-col justify-center rounded shadow-inner inset-5".split(
    " "
  );
  const bg = (weight: number) => `bg-${props.color}-${weight}`;

  if (props.keyboardDisabled) {
    classNames.push(bg(50), "opacity-50");
  } else if (props.keyboardActive) {
    classNames.push(bg(200));
  } else {
    classNames.push(bg(100));
  }

  return (
    <div className={classNames.join(" ")}>
      <Keyboard runtime={props.runtime} />
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
