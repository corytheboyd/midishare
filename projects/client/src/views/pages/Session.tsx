import React, { useCallback, useEffect, useMemo } from "react";
import { Chrome } from "../Chrome";
import { Helmet } from "react-helmet";
import { PeerLane } from "../PeerLane";
import { AttachMidiPrompt } from "../PeerLane/AttachMidiPrompt";
import { createRuntime } from "@midishare/keyboard";
import { useStore } from "../../lib/store";

const localColor = "blue";
const remoteColor = "yellow";

export const Session: React.FC = () => {
  const session = useStore((state) => state.session);
  const localRuntime = useMemo(() => session?.localKeyboardRuntime, [session]);
  const remoteRuntime = useMemo(() => session?.remoteKeyboardRuntime, [
    session,
  ]);

  useEffect(() => {
    if (!session) {
      useStore.getState().createSession();
    }
  }, [session]);

  const activeMidiInputDeviceId = useStore(
    (state) => state.activeMidiInputDeviceId
  );

  return (
    <Chrome hideFooter={true}>
      <Helmet>
        <title>Midishare • Session</title>
      </Helmet>

      {session && localRuntime && remoteRuntime && (
        <div className="flex flex-col h-full w-full space-y-2 p-2">
          {/* Remote Peer */}
          <PeerLane runtime={remoteRuntime} color={remoteColor} />

          {/* Local Peer */}
          <PeerLane
            runtime={localRuntime}
            color={localColor}
            keyboardDisabled={!activeMidiInputDeviceId}
            disabledMessageContent={<AttachMidiPrompt />}
          />
        </div>
      )}
    </Chrome>
  );
};
