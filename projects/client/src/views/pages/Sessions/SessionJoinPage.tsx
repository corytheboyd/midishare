import { Chrome, MaxWidthContent } from "../../Chrome";
import { Helmet } from "react-helmet";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import { LargePrimaryButton } from "../../common/buttons/LargePrimaryButton";
import { Play } from "../../common/icons/sm/Play";
import { joinSession } from "../../../lib/mutations/joinSession";
import { queryClient } from "../../../lib/queryClient";
import {
  queryKey as getSessionQueryKey,
  getSession,
} from "../../../lib/queries/getSession";
import { Session } from "@midishare/common";
import { useStore } from "../../../lib/store";
import { Routes } from "../../routes";
import { InlineErrorMessage } from "../../common/InlineErrorMessage";

/**
 * This is slick, thanks StackOverflow lol
 * @see https://stackoverflow.com/a/49889856/14920432
 *
 * TODO this is used on server too... if we need to share it, just share it
 *  through common... maybe? Avoiding it for now because duplication is free
 *  and easy.
 * */
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export const SessionJoinPage: React.FC = () => {
  const urlParams = useParams<{ id: string }>();
  const history = useHistory();

  const sessionQuery = useQuery<ThenArg<ReturnType<typeof getSession>>, Error>(
    getSessionQueryKey(urlParams.id),
    () => getSession(urlParams.id)
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
    useStore.getState().initializeRuntime();
    history.push(Routes.SESSION.replace(/:id/, session.id));
  };

  const joinDisabled = sessionQuery.isLoading || joinSessionMutation.isLoading;

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

          <div className={`mt-2 space-y-1.5 ${joinDisabled && "opacity-50"}`}>
            {sessionQuery.isError && (
              <InlineErrorMessage message={sessionQuery.error!.message} />
            )}

            {joinSessionMutation.isError && (
              <InlineErrorMessage
                message={joinSessionMutation.error!.message}
              />
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
