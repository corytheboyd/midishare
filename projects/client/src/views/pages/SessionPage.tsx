import React, { useMemo } from "react";
import { Chrome } from "../Chrome";
import { Helmet } from "react-helmet";
import { PeerLane } from "../PeerLane";
import { AttachMidiPrompt } from "../PeerLane/AttachMidiPrompt";
import { useStore } from "../../lib/store";
import { InviteGuestPrompt } from "../PeerLane/InviteGuestPrompt";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import {
  getSession,
  queryKey as sessionQueryKey,
} from "../../lib/queries/getSession";
import { Session } from "@midishare/common";
import {
  getCurrentUser,
  queryKey as userProfileQueryKey,
} from "../../lib/queries/getCurrentUser";

const localColor = "blue";
const remoteColor = "yellow";

export const SessionPage: React.FC = () => {
  const urlParams = useParams<{
    /**
     * The ID of the Session.
     *
     * @see projects/client/src/views/routes.ts
     * */
    id: string;
  }>();

  // TODO maybe don't need? react-query is making this way easier!!
  const session = useStore((state) => state.session);

  // ...but this still makes sense to keep in a global store of course
  const runtime = useStore((state) => state.runtime);

  const userQuery = useQuery(userProfileQueryKey(), getCurrentUser);
  const sessionQuery = useQuery<Session>(
    sessionQueryKey(urlParams.id),
    () => getSession(urlParams.id),
    {
      onSuccess: (session) => {
        // TODO Again, might not even want to keep session in global state.
        useStore.getState().setSession(session);

        useStore.getState().initializeRuntime();
      },
    }
  );

  const isCurrentUserHost = useMemo<boolean | undefined>(() => {
    // Not authenticated, impossible to be host
    if (userQuery.data === null) {
      return false;
    }

    if (!sessionQuery.data || !userQuery.data) {
      return;
    }

    return userQuery.data.sub === sessionQuery.data.participants.host;
  }, [userQuery.data, sessionQuery.data]);

  const activeMidiInputDeviceId = useStore(
    (state) => state.activeMidiInputDeviceId
  );

  const isLoading = userQuery.isLoading || sessionQuery.isLoading;

  console.debug("isCurrentUserHost", isCurrentUserHost);
  console.debug("isLoading", isLoading);

  return (
    <Chrome hideFooter={true}>
      <Helmet>
        <title>Midishare • Session</title>
      </Helmet>

      {isLoading && <span>Loading...</span>}

      {!isLoading && (
        <>
          {session && runtime && (
            <div className="flex flex-col h-full w-full space-y-2 p-2">
              {/* Remote Peer */}
              <PeerLane
                runtime={runtime.remoteKeyboardRuntime}
                color={remoteColor}
                keyboardDisabled={!session.participants.guest}
                disabledMessageContent={<InviteGuestPrompt />}
              />

              {/* Local Peer */}
              <PeerLane
                runtime={runtime.localKeyboardRuntime}
                color={localColor}
                keyboardDisabled={!activeMidiInputDeviceId}
                disabledMessageContent={<AttachMidiPrompt />}
              />
            </div>
          )}
        </>
      )}
    </Chrome>
  );
};
