import { Chrome, MaxWidthContent } from "../Chrome";
import { Helmet } from "react-helmet";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { getSession, queryKey } from "../../lib/queries/getSession";
import { useHistory, useParams } from "react-router-dom";
import { LargePrimaryButton } from "../common/buttons/LargePrimaryButton";
import { Play } from "../common/icons/sm/Play";
import { joinSession } from "../../lib/mutations/joinSession";
import { queryClient } from "../../lib/queryClient";
import { queryKey as getSessionQueryKey } from "../../lib/queries/getSession";
import { Session } from "@midishare/common";
import { useStore } from "../../lib/store";
import { Routes } from "../routes";
import { ExclamationCircle } from "../common/icons/sm/ExclamationCircle";

export const SessionJoinPage: React.FC = () => {
  const urlParams = useParams<{ id: string }>();
  const history = useHistory();

  const getSessionQuery = useQuery(queryKey(urlParams.id), () =>
    getSession(urlParams.id)
  );

  const joinSessionMutation = useMutation<Session, Error>(
    () => joinSession(urlParams.id),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(getSessionQueryKey(data.id), data);
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const handleJoinSession = async () => {
    const session = await joinSessionMutation.mutateAsync();

    useStore.getState().setSession(session);

    history.push(Routes.SESSION.replace(/id/, session.id));
  };

  const joinDisabled =
    getSessionQuery.isLoading || joinSessionMutation.isLoading;

  return (
    <Chrome hideFooter={true}>
      <Helmet>
        <title>Midishare • Join Session</title>
      </Helmet>

      <div className="flex flex-col items-center justify-center mt-4 px-3">
        <MaxWidthContent>
          <div>
            <h1 className="text-xl font-bold font-serif">Join Session</h1>
            <p className="text-md text-gray-500">
              You have been invited to join a Midishare session!
            </p>
          </div>

          <div className={`mt-2 ${joinDisabled && "opacity-50"}`}>
            {joinSessionMutation.isError && (
              <div className="text-red-500 mb-1.5">
                <div className="flex space-x-2 items-center">
                  <div className="w-5 h-5">
                    <ExclamationCircle />
                  </div>
                  <p className="text-sm">
                    Something went wrong with your request, try again shortly!
                  </p>
                </div>
              </div>
            )}

            <LargePrimaryButton
              disabled={joinDisabled}
              onClick={handleJoinSession}
            >
              <div className="w-6 h-6">
                <Play />
              </div>
              <span className="text-lg">
                {joinSessionMutation.isLoading ? "Joining..." : "Join Session"}
              </span>
            </LargePrimaryButton>
          </div>
        </MaxWidthContent>
      </div>
    </Chrome>
  );
};
