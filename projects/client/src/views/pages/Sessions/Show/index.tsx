import React, { useEffect, useMemo } from "react";
import { Chrome } from "../../../Chrome";
import { Helmet } from "react-helmet";
import { store, useStore } from "../../../../lib/store";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import {
  getSession,
  queryKey,
  queryKey as sessionQueryKey,
} from "../../../../lib/queries/getSession";
import { PeerLaneController } from "./PeerLaneController";
import { NotFound } from "../../NotFound";
import { usePeerConnection } from "../../../../lib/rtc/usePeerConnection";
import {
  queryKey as currentUserQueryKey,
  getCurrentUser,
} from "../../../../lib/queries/getCurrentUser";
import { useSocket } from "../../../../lib/ws/useSocket";
import { queryClient } from "../../../../lib/queryClient";
import { AllowedInputEventTypes } from "../../../../lib/createMidiInputHandler";
import { playKeyboard } from "../../../../lib/playKeyboard";
import { WebSocketSubType } from "@midishare/common";
import {
  buildSessionShowContext,
  SessionShowContext,
} from "./SessionShowContext";
import { Routes } from "../../../routes";
import { CopyTextInput } from "../../../common/CopyTextInput";
import { CopyTextButton } from "../../../common/CopyTextButton";
import { UserAdd } from "../../../common/icons/sm/UserAdd";

export const SessionShowPage: React.FC = () => {
  const urlParams = useParams<{ id: string }>();

  const currentUserQuery = useQuery(currentUserQueryKey(), getCurrentUser);

  const sessionQuery = useQuery(
    sessionQueryKey(urlParams.id),
    () => getSession(urlParams.id),
    {
      onSuccess: () => {
        useStore.getState().initializeRuntime();
      },
    }
  );

  const connection = usePeerConnection(urlParams.id);

  // Intentionally re-evaluated on every render, then passed through React
  // context
  // TODO instead of sprinkling react-query everywhere below this
  //  hierarchically, move things up to context instead that should be here
  const context = buildSessionShowContext({
    currentUser: currentUserQuery.data,
    session: sessionQuery.data,
  });

  useEffect(() => {
    if (!sessionQuery.data) {
      return;
    }
    connection.setPolite(
      currentUserQuery.data?.sub === sessionQuery.data.participants.host
    );
    connection.start();
  }, [sessionQuery.isSuccess, currentUserQuery.isSuccess]);

  const sessionDataSocket = useSocket({
    type: WebSocketSubType.SESSION_DATA,
    sessionId: urlParams.id,
  });

  useEffect(() => {
    sessionDataSocket.onMessage((data) => {
      queryClient.setQueryData(queryKey(urlParams.id), JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    return connection.onMidiData((data) => {
      const [timestamp, ...midi] = data;

      let eventType: AllowedInputEventTypes | null = null;
      if (midi[0] === 144) {
        if (midi[2] > 0) {
          eventType = "noteon";
        } else {
          eventType = "noteoff";
        }
      } else if (midi[0] === 128) {
        eventType = "noteoff";
      } else if (midi[0] === 176) {
        eventType = "controlchange";
      }

      if (eventType) {
        const runtime = store.getState().runtime?.remoteKeyboardRuntime;
        if (!runtime) {
          throw new Error("Runtime not initialized");
        }

        playKeyboard(
          "remote",
          eventType,
          timestamp,
          Uint8Array.from(midi),
          context
        );
      }
    });
  }, [context]);

  if (!sessionQuery.isLoading && !sessionQuery.data) {
    return <NotFound message="Session does not exist" />;
  }

  const joinUrl = useMemo(() => {
    const url = new URL(process.env.PUBLIC_URL as string);
    url.pathname = Routes.SESSION_JOIN.replace(/:id/, urlParams.id);
    return url.toString();
  }, [urlParams.id]);

  return (
    <SessionShowContext.Provider value={context}>
      <Chrome hideFooter={true}>
        <Helmet>
          <title>Midishare • Session</title>
        </Helmet>

        {sessionQuery.isLoading && <span>Loading...</span>}

        {!sessionQuery.isLoading && (
          <div className="w-full h-full flex justify-center w-full py-3">
            <div className="flex flex-col w-full max-w-6xl space-y-3">
              <PeerLaneController session={sessionQuery.data!} />

              {/*Host session controls*/}
              {context.isHost && (
                <div className="bg-gray-200 w-full p-3 rounded-lg shadow-inner text-gray-700">
                  <div className="flex justify-between">
                    <div className="flex items-baseline space-x-2">
                      <h3 className="font-bold">Session Settings</h3>
                      <span className="text-xs text-gray-500">
                        Only you can see this section
                      </span>
                    </div>

                    <div className="text-sm flex flex-row items-center space-x-1">
                      <div className="h-6 w-6 flex">
                        <UserAdd />
                      </div>
                      <CopyTextInput source={joinUrl} clipboardId="joinUrl" />
                      <CopyTextButton clipboardId="joinUrl" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Chrome>
    </SessionShowContext.Provider>
  );
};
