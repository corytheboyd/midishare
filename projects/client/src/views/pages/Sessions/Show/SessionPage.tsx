import React from "react";
import { Chrome } from "../../../Chrome";
import { Helmet } from "react-helmet";
import { useStore } from "../../../../lib/store";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import {
  getSession,
  queryKey as sessionQueryKey,
} from "../../../../lib/queries/getSession";
import { PeerLaneController } from "./PeerLaneController";

export const SessionPage: React.FC = () => {
  const urlParams = useParams<{ id: string }>();

  const sessionQuery = useQuery(
    sessionQueryKey(urlParams.id),
    () => getSession(urlParams.id),
    {
      onSuccess: () => {
        useStore.getState().initializeRuntime();
      },
    }
  );

  return (
    <Chrome hideFooter={true}>
      <Helmet>
        <title>Midishare • Session</title>
      </Helmet>

      {sessionQuery.isLoading && <span>Loading...</span>}

      {!sessionQuery.isLoading && (
        <PeerLaneController session={sessionQuery.data!} />
      )}
    </Chrome>
  );
};
