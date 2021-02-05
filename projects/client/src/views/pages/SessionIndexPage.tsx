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
import { deleteSession } from "../../lib/mutations/deleteSession";
import { SmallSecondaryButton } from "../common/buttons/SmallSecondaryButton";

export const SessionIndexPage: React.FC = () => {
  const history = useHistory();

  const allSessionsQuery = useQuery<Session[], Error>(
    getAllSessionsQueryKey(),
    () => getAllSessions()
  );

  const createSessionMutation = useMutation<Session, Error>(createSession, {
    onSuccess: (data) => {
      queryClient.setQueryData(getSessionQueryKey(data.id), data);
    },
  });

  const deleteSessionMutation = useMutation<Session, Error, { id: string }>(
    ({ id }) => deleteSession(id),
    {
      onSuccess: (session, variables) => {
        queryClient.removeQueries(getSessionQueryKey(variables.id));
        return queryClient.invalidateQueries(getAllSessionsQueryKey());
      },
    }
  );

  const handleCreateSession = async () => {
    const session = await createSessionMutation.mutateAsync();
    navigateToSession(session);
  };

  const handleDeleteSession = async (id: string) => {
    deleteSessionMutation.mutate({ id });
  };

  const navigateToSession = (session: Session) => {
    // TODO move entirely to react-query for data loading
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
          <div className="space-y-3">
            <div>
              <h1 className="text-xl font-bold font-serif">Create Session</h1>
              <p className="text-md text-gray-500">
                Starts a new real-time MIDI streaming session that you can
                invite someone to join.
              </p>
            </div>

            {createSessionMutation.isError && (
              <InlineErrorMessage
                message={createSessionMutation.error!.message}
              />
            )}

            <div>
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

            {!allSessionsQuery.isLoading && allSessionsQuery.data!.length > 0 && (
              <div className="pt-3">
                <h1 className="text-xl font-bold font-serif">Sessions</h1>

                {allSessionsQuery.isError && (
                  <InlineErrorMessage
                    message={allSessionsQuery.error!.message}
                  />
                )}

                <div className="w-full">
                  {allSessionsQuery.data!.map((session) => (
                    <div key={session.id} className="py-1 flex">
                      <div className="flex-grow">
                        <span>{session.id}</span>
                      </div>
                      <div className="space-x-2 text-sm">
                        <SmallSecondaryButton color="green">
                          Join
                        </SmallSecondaryButton>

                        <SmallSecondaryButton
                          color="red"
                          disabled={deleteSessionMutation.isLoading}
                          onClick={() => handleDeleteSession(session.id)}
                        >
                          Delete
                        </SmallSecondaryButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </MaxWidthContent>
      </div>
    </Chrome>
  );
};
