import React from "react";
import { KeyboardWell } from "./KeyboardWell";
import { Runtime } from "@midishare/keyboard";
import { KeyboardInfoWell } from "./KeyboardInfoWell";

export type PeerLaneProps = {
  runtime: Runtime;
  keyboardDisabled?: boolean;
  disabledMessageContent?: JSX.Element;
};

export const PeerLane: React.FC<PeerLaneProps> = (props) => {
  return (
    <div className="w-full h-full flex space-x-2 max-w-6xl">
      <KeyboardWell {...props} />
      <KeyboardInfoWell {...props} />
      {/*<div className="w-80 flex-grow-0 flex flex-col space-y-2">*/}
      {/*  <VideoWell {...props} />*/}
      {/*  <div className="flex-auto flex justify-center items-center">*/}
      {/*    <span>stats and stuff</span>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};
