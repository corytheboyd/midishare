import React, { useMemo } from "react";
import { Chrome } from "../Chrome";
import { createRuntime, Keyboard, Runtime } from "@midishare/keyboard";
import { Helmet } from "react-helmet";

type PeerLaneProps = {
  runtime: Runtime;
  color: "green" | "purple" | "red" | "blue" | "yellow";
};

const PeerLane: React.FC<PeerLaneProps> = (props) => {
  return (
    <div className="w-full h-full flex space-x-2">
      <div
        className={`flex-auto p-3 flex flex-col justify-center rounded shadow-inner inset-5 bg-${props.color}-100`}
      >
        <Keyboard runtime={props.runtime} />
      </div>
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

export const Session: React.FC = () => {
  const localColor = "blue";
  const remoteColor = "yellow";

  const localRuntime = useMemo(
    () =>
      createRuntime({
        keyPressedColor: localColor,
      }),
    []
  );

  const remoteRuntime = useMemo(
    () =>
      createRuntime({
        keyPressedColor: remoteColor,
      }),
    []
  );

  return (
    <Chrome>
      <Helmet>
        <title>Midishare • Session</title>
      </Helmet>

      <div className="flex flex-col h-full w-full space-y-2 p-2">
        <PeerLane runtime={remoteRuntime} color={remoteColor} />
        <PeerLane runtime={localRuntime} color={localColor} />
      </div>
    </Chrome>
  );
};
