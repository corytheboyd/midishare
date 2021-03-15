import { PeerLane } from "./PeerLane";
import { InviteGuestPrompt } from "./PeerLane/InviteGuestPrompt";
import { AttachMidiPrompt } from "./PeerLane/AttachMidiPrompt";
import React, { useMemo } from "react";
import { useStore } from "../../../../lib/store";
import { Session } from "@midishare/common";
import { useQuery } from "react-query";
import {
  getCurrentUser,
  queryKey as userProfileQueryKey,
} from "../../../../lib/queries/getCurrentUser";

type PeerLaneControllerProps = {
  session: Session;
};

export const PeerLaneController: React.FC<PeerLaneControllerProps> = (
  props
) => {
  const runtime = useStore((state) => state.runtime);

  const activeMidiInputDeviceId = useStore(
    (state) => state.activeMidiInputDeviceId
  );

  const userQuery = useQuery(userProfileQueryKey(), getCurrentUser);

  const isCurrentUserHost = useMemo<boolean | undefined>(() => {
    // Not authenticated, impossible to be host
    if (!userQuery.data) {
      return false;
    }
    return userQuery.data.sub === props.session.participants.host;
  }, [userQuery.data, props.session]);

  return (
    <div className="flex flex-col items-center h-full w-full space-y-2 p-2">
      {/* Remote Peer, Host mode */}
      {isCurrentUserHost === true && (
        <PeerLane
          runtime={runtime!.remoteKeyboardRuntime}
          keyboardDisabled={!props.session.participants.guest}
          disabledMessageContent={
            <InviteGuestPrompt sessionId={props.session.id} />
          }
        />
      )}

      {isCurrentUserHost === false && (
        <PeerLane runtime={runtime!.remoteKeyboardRuntime} />
      )}

      {/* Local Peer */}
      <PeerLane
        runtime={runtime!.localKeyboardRuntime}
        keyboardDisabled={!activeMidiInputDeviceId}
        disabledMessageContent={<AttachMidiPrompt />}
      />
    </div>
  );
};
