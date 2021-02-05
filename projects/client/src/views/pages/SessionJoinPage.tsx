import { Chrome, MaxWidthContent } from "../Chrome";
import { Helmet } from "react-helmet";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { getSession, queryKey } from "../../lib/queries/getSession";
import { useParams } from "react-router-dom";
import { LargePrimaryButton } from "../common/buttons/LargePrimaryButton";
import { Play } from "../common/icons/sm/Play";
import { joinSession } from "../../lib/mutations/joinSession";
import { queryClient } from "../../lib/queryClient";
import { queryKey as getSessionQueryKey } from "../../lib/queries/getSession";
import { Session } from "@midishare/common";
import { useStore } from "../../lib/store";

export const SessionJoinPage: React.FC = () => {
  const urlParams = useParams<{ id: string }>();

  const getSessionQuery = useQuery(queryKey(urlParams.id), () =>
    getSession(urlParams.id)
  );

  const joinSessionMutation = useMutation<Session, Error>(
    () => joinSession(urlParams.id),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(getSessionQueryKey(data.id), data);
      },
    }
  );

  const handleJoinSession = async () => {
    const session = await joinSessionMutation.mutateAsync();

    useStore.getState().setSession(session);
  };

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

          <div className="mt-2">
            <LargePrimaryButton
              disabled={joinSessionMutation.isLoading}
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
