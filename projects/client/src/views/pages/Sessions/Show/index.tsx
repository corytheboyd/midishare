import React, { useEffect } from "react";
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

  return (
    <SessionShowContext.Provider value={context}>
      <Chrome hideFooter={true}>
        <Helmet>
          <title>Midishare • Session</title>
        </Helmet>

        {sessionQuery.isLoading && <span>Loading...</span>}

        {!sessionQuery.isLoading && (
          <PeerLaneController session={sessionQuery.data!} />
        )}
      </Chrome>
    </SessionShowContext.Provider>
  );
};
