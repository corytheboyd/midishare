import React, { useEffect } from "react";
import { Chrome } from "../../../Chrome";
import { Helmet } from "react-helmet";
import { useStore } from "../../../../lib/store";
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
import { WebSocketSubType } from "@midishare/common";
import { queryClient } from "../../../../lib/queryClient";

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

  const sessionDataSocket = useSocket({
    type: WebSocketSubType.SESSION_DATA,
    sessionId: urlParams.id,
  });

  useEffect(() => {
    sessionDataSocket.onMessage((data) => {
      // TODO this is very naive, and will quickly lead to data clobbering
      //  issues if session data grows to contain more things.
      queryClient.setQueryData(queryKey(urlParams.id), JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    if (!sessionQuery.data || !userQuery.data) {
      return;
    }
    connection.setPolite(
      userQuery.data &&
        userQuery.data.sub === sessionQuery.data.participants.host
    );
  }, [sessionQuery.isSuccess, userQuery.isSuccess]);

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
