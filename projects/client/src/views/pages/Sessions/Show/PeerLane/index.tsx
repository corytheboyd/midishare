import React from "react";
import { KeyboardWell } from "./KeyboardWell";
import { Runtime } from "@midishare/keyboard";

export type PeerLaneProps = {
  runtime: Runtime;
  keyboardDisabled?: boolean;
  disabledMessageContent?: JSX.Element;
  isLocal: boolean;
};

export const PeerLane: React.FC<PeerLaneProps> = (props) => {
  return (
    <>
      <KeyboardWell {...props} />
      {/*<div className="w-80 flex-grow-0 flex flex-col space-y-2">*/}
      {/*  <VideoWell {...props} />*/}
      {/*  <div className="flex-auto flex justify-center items-center">*/}
      {/*    <span>stats and stuff</span>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </>
  );
};
