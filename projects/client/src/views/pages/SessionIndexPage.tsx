import React from "react";
import { Chrome, MaxWidthContent } from "../Chrome";
import { Play } from "../common/icons/sm/Play";
import { BaseButton } from "../common/buttons/BaseButton";
import { Helmet } from "react-helmet";
import { useMutation } from "react-query";
import { ExclamationCircle } from "../common/icons/sm/ExclamationCircle";
import { useHistory } from "react-router-dom";
import { Routes } from "../routes";
import { useStore } from "../../lib/store";
import { Session } from "@midishare/common";
import { Queries, queryClient } from "../../lib/queryClient";
import { createSession } from "../../lib/mutations/createSession";
import { queryKey as getSessionQueryKey } from "../../lib/queries/getSession";
import { LargePrimaryButton } from "../common/buttons/LargePrimaryButton";

export const SessionIndexPage: React.FC = () => {
  const history = useHistory();

  const mutation = useMutation<Session, Error>(createSession, {
    onSuccess: (data) => {
      queryClient.setQueryData(getSessionQueryKey(data.id), data);
    },
  });

  const handleCreateSession = async () => {
    const session = await mutation.mutateAsync();

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
            {mutation.isError && (
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
              disabled={mutation.isLoading}
              onClick={handleCreateSession}
            >
              <div className="w-6 h-6">
                <Play />
              </div>
              <span className="text-lg">
                {mutation.isLoading ? "Starting..." : "Start Session"}
              </span>
            </LargePrimaryButton>
          </div>
        </MaxWidthContent>
      </div>
    </Chrome>
  );
};
