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
import { AllowedInputEventTypes } from "../../../../lib/handleMidiInput";
import { playKeyboard } from "../../../../lib/playKeyboard";
import { WebSocketSubType } from "@midishare/common";

export const SessionShowPage: React.FC = () => {
  const urlParams = useParams<{ id: string }>();

  const userQuery = useQuery(currentUserQueryKey(), getCurrentUser);
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

  useEffect(() => {
    if (!sessionQuery.data) {
      return;
    }
    connection.setPolite(
      userQuery.data?.sub === sessionQuery.data.participants.host
    );
    connection.start();
  }, [sessionQuery.isSuccess, userQuery.isSuccess]);

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
    connection.onMidiData((data) => {
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
        playKeyboard(eventType, timestamp, Uint8Array.from(midi), runtime);
      }
    });
  }, []);

  if (!sessionQuery.isLoading && !sessionQuery.data) {
    return <NotFound message="Session does not exist" />;
  }

  return (
    <Chrome hideFooter={true}>
      <Helmet>
        <title>Midishare • Session</title>
      </Helmet>

      <div className="flex flex-col h-full">
        <div className="flex-grow">
          {sessionQuery.isLoading && <span>Loading...</span>}

          {!sessionQuery.isLoading && (
            <PeerLaneController session={sessionQuery.data!} />
          )}
        </div>
      </div>
    </Chrome>
  );
};
