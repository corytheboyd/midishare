import { PeerLane } from "./PeerLane";
import { InviteGuestPrompt } from "./PeerLane/InviteGuestPrompt";
import { AttachMidiPrompt } from "./PeerLane/AttachMidiPrompt";
import React, { useContext } from "react";
import { useStore } from "../../../../lib/store";
import { Session } from "@midishare/common";
import { SessionShowContext } from "./SessionShowContext";

type PeerLaneControllerProps = {
  session: Session;
};

export const PeerLaneController: React.FC<PeerLaneControllerProps> = (
  props
) => {
  const context = useContext(SessionShowContext);

  const activeMidiInputDeviceId = useStore(
    (state) => state.activeMidiInputDeviceId
  );

  return (
    <>
      {/* Remote Peer, Host mode */}
      {context.isHost === true && (
        <PeerLane
          isLocal={false}
          runtime={context.remoteRuntime!}
          keyboardDisabled={!props.session.participants.guest}
          disabledMessageContent={
            <InviteGuestPrompt sessionId={props.session.id} />
          }
        />
      )}

      {context.isHost === false && (
        <PeerLane isLocal={false} runtime={context.remoteRuntime!} />
      )}

      {/* Local Peer */}
      <PeerLane
        isLocal={true}
        runtime={context.localRuntime!}
        keyboardDisabled={!activeMidiInputDeviceId}
        disabledMessageContent={<AttachMidiPrompt />}
      />
    </>
  );
};
