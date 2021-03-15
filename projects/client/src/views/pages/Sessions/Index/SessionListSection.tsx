import React from "react";
import { InlineErrorMessage } from "../../../common/InlineErrorMessage";
import { SmallSecondaryButton } from "../../../common/buttons/SmallSecondaryButton";
import { useMutation, useQuery } from "react-query";
import { deleteSession } from "../../../../lib/mutations/deleteSession";
import { queryClient } from "../../../../lib/queryClient";
import { queryKey as getSessionQueryKey } from "../../../../lib/queries/getSession";
import {
  getAllSessions,
  queryKey as getAllSessionsQueryKey,
} from "../../../../lib/queries/getAllSessions";
import { Session } from "@midishare/common";
import {
  getCurrentUser,
  queryKey,
} from "../../../../lib/queries/getCurrentUser";

type SessionListSectionProps = {
  navigateToSession: (session: Session) => void;
};

export const SessionListSection: React.FC<SessionListSectionProps> = (
  props
) => {
  const currentUserQuery = useQuery(queryKey(), getCurrentUser);

  const sessionsQuery = useQuery<Session[], Error>(
    getAllSessionsQueryKey(),
    () => getAllSessions()
  );

  const deleteSessionMutation = useMutation<void, Error, { id: string }>(
    ({ id }) => deleteSession(id),
    {
      onSuccess: (session, variables) => {
        queryClient.removeQueries(getSessionQueryKey(variables.id));
        return queryClient.invalidateQueries(getAllSessionsQueryKey());
      },
    }
  );

  const handleDeleteSession = async (id: string) => {
    deleteSessionMutation.mutate({ id });
  };

  return (
    <section>
      <div>
        <h1 className="text-xl font-bold font-serif">Sessions</h1>
        <p className="text-sm opacity-75">
          The sessions that you are currently participating in
        </p>
      </div>

      {sessionsQuery.isError && (
        <InlineErrorMessage message={sessionsQuery.error!.message} />
      )}

      <div className="w-full mt-3 space-y-1.5">
        {deleteSessionMutation.isError && (
          <InlineErrorMessage message={deleteSessionMutation.error!.message} />
        )}

        {sessionsQuery.isLoading && <span>Loading...</span>}

        {!sessionsQuery.isLoading &&
          sessionsQuery.data!.map((session) => {
            const showDeleteButton =
              currentUserQuery.data &&
              session.participants.host === currentUserQuery.data.sub;

            return (
              <div key={session.id} className="py-1 flex">
                <div className="flex-grow">
                  <span>{session.id}</span>
                </div>
                <div className="space-x-2 text-sm">
                  <SmallSecondaryButton
                    color="green"
                    onClick={() => props.navigateToSession(session)}
                  >
                    Join
                  </SmallSecondaryButton>

                  {showDeleteButton && (
                    <SmallSecondaryButton
                      color="red"
                      disabled={deleteSessionMutation.isLoading}
                      onClick={() => handleDeleteSession(session.id)}
                    >
                      Delete
                    </SmallSecondaryButton>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
};
