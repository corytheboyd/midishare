import React from "react";
import { InlineErrorMessage } from "../../../common/InlineErrorMessage";
import { LargePrimaryButton } from "../../../common/buttons/LargePrimaryButton";
import { Play } from "../../../common/icons/sm/Play";
import { useMutation } from "react-query";
import { createSession } from "../../../../lib/mutations/createSession";
import { queryClient } from "../../../../lib/queryClient";
import { queryKey as getSessionQueryKey } from "../../../../lib/queries/getSession";
import { Session } from "@midishare/common";

type CreateSessionSectionProps = {
  navigateToSession: (session: Session) => void;
};

export const CreateSessionSection: React.FC<CreateSessionSectionProps> = (
  props
) => {
  const createSessionMutation = useMutation<Session, Error>(createSession, {
    onSuccess: (data) => {
      queryClient.setQueryData(getSessionQueryKey(data.id), data);
      // return queryClient.invalidateQueries(getAllSessionsQueryKey());
    },
  });

  const handleCreateSession = async () => {
    const session = await createSessionMutation.mutateAsync();
    props.navigateToSession(session);
  };

  return (
    <section>
      <div>
        <h1 className="text-xl font-bold font-serif">Create Session</h1>
        <p className="text-sm opacity-75">
          Starts a new real-time MIDI streaming session that you can invite
          someone to join.
        </p>
      </div>

      {createSessionMutation.isError && (
        <InlineErrorMessage message={createSessionMutation.error!.message} />
      )}

      <div className="mt-3">
        <LargePrimaryButton
          disabled={createSessionMutation.isLoading}
          onClick={handleCreateSession}
        >
          <div className="w-6 h-6">
            <Play />
          </div>
          <span className="text-lg">
            {createSessionMutation.isLoading ? "Starting..." : "Start Session"}
          </span>
        </LargePrimaryButton>
      </div>
    </section>
  );
};
