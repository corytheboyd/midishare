import React, { useEffect, useMemo } from "react";
import { Chrome } from "../Chrome";
import { Helmet } from "react-helmet";
import { PeerLane } from "../PeerLane";
import { AttachMidiPrompt } from "../PeerLane/AttachMidiPrompt";
import {
  createRuntime,
  getKeyNameFromIndex,
  Runtime,
} from "@midishare/keyboard";
import { useStore } from "../../lib/store";

const localColor = "blue";
const remoteColor = "yellow";

export const Session: React.FC = () => {
  const activeMidiInputDeviceId = useStore(
    (state) => state.activeMidiInputDeviceId
  );

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

  useEffect(() => {
    const intervalIds: NodeJS.Timeout[] = [];

    const loop = (runtime: Runtime) => {
      intervalIds.push(
        setInterval(() => {
          const randomKey = getKeyNameFromIndex(Math.floor(Math.random() * 87));
          const randomVelocity = Math.ceil(Math.random() * 127);

          runtime.keyOn(randomKey, randomVelocity);
          setTimeout(() => {
            runtime.keyOff(randomKey);
          }, 500);
        }, 1000)
      );
    };

    // setTimeout(() => loop(localRuntime), Math.random() * 250);
    setTimeout(() => loop(remoteRuntime), Math.random() * 250);

    return () => intervalIds.forEach((id) => clearInterval(id));
  }, []);

  return (
    <Chrome hideFooter={true}>
      <Helmet>
        <title>Midishare • Session</title>
      </Helmet>

      <div className="flex flex-col h-full w-full space-y-2 p-2">
        <PeerLane runtime={remoteRuntime} color={remoteColor} />
        <PeerLane
          runtime={localRuntime}
          color={localColor}
          keyboardDisabled={!activeMidiInputDeviceId}
          disabledMessageContent={<AttachMidiPrompt />}
        />
      </div>
    </Chrome>
  );
};
