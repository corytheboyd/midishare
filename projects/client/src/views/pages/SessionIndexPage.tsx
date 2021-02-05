import React from "react";
import { Chrome, MaxWidthContent } from "../Chrome";
import { Play } from "../common/icons/sm/Play";
import { Helmet } from "react-helmet";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Routes } from "../routes";
import { useStore } from "../../lib/store";
import { Session } from "@midishare/common";
import { queryClient } from "../../lib/queryClient";
import { createSession } from "../../lib/mutations/createSession";
import { queryKey as getSessionQueryKey } from "../../lib/queries/getSession";
import { LargePrimaryButton } from "../common/buttons/LargePrimaryButton";
import { InlineErrorMessage } from "../common/InlineErrorMessage";
import {
  getAllSessions,
  queryKey as getAllSessionsQueryKey,
} from "../../lib/queries/getAllSessions";

export const SessionIndexPage: React.FC = () => {
  const history = useHistory();

  const allSessionsQuery = useQuery<Session[], Error>(
    getAllSessionsQueryKey(),
    () => getAllSessions()
  );
  console.debug("allSessionsQuery", allSessionsQuery);

  const createSessionMutation = useMutation<Session, Error>(createSession, {
    onSuccess: (data) => {
      queryClient.setQueryData(getSessionQueryKey(data.id), data);
    },
  });

  const handleCreateSession = async () => {
    const session = await createSessionMutation.mutateAsync();

    useStore.getState().setSession(session);
    useStore.getState().initializeRuntime();

    history.push(Routes.SESSION.replace(/:id/, session.id));
  };

  return (
    <Chrome>
      <Helmet>
        <title>Midishare • Sessions</title>
      </Helmet>

      <div className="flex flex-col mt-4 px-3">
        <MaxWidthContent>
          <div>
            <h1 className="text-xl font-bold font-serif">Create Session</h1>
            <p className="text-md text-gray-500">
              Starts a new real-time MIDI streaming session that you can invite
              someone to join.
            </p>
          </div>

          <div className="mt-2">
            {createSessionMutation.isError && (
              <InlineErrorMessage
                message={createSessionMutation.error!.message}
              />
            )}

            <LargePrimaryButton
              disabled={createSessionMutation.isLoading}
              onClick={handleCreateSession}
            >
              <div className="w-6 h-6">
                <Play />
              </div>
              <span className="text-lg">
                {createSessionMutation.isLoading
                  ? "Starting..."
                  : "Start Session"}
              </span>
            </LargePrimaryButton>
          </div>
        </MaxWidthContent>
      </div>
    </Chrome>
  );
};
