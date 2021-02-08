import React from "react";
import { Chrome, MaxWidthContent } from "../../../Chrome";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Routes } from "../../../routes";
import { useStore } from "../../../../lib/store";
import { Session } from "@midishare/common";
import {
  getCurrentUser,
  queryKey as currentUserQueryKey,
} from "../../../../lib/queries/getCurrentUser";
import { CreateSessionSection } from "./CreateSessionSection";
import { SessionListSection } from "./SessionListSection";

export const SessionIndexPage: React.FC = () => {
  const history = useHistory();

  const currentUserQuery = useQuery(currentUserQueryKey(), getCurrentUser);

  const navigateToSession = (session: Session) => {
    useStore.getState().initializeRuntime();
    history.push(Routes.SESSION.replace(/:id/, session.id));
  };

  const showCreateSession =
    !currentUserQuery.isLoading && !!currentUserQuery.data;

  return (
    <Chrome>
      <Helmet>
        <title>Midishare • Sessions</title>
      </Helmet>

      <div className="flex flex-col mt-4 px-3">
        <MaxWidthContent>
          <div className="space-y-5">
            {showCreateSession && (
              <CreateSessionSection navigateToSession={navigateToSession} />
            )}

            <SessionListSection navigateToSession={navigateToSession} />
          </div>
        </MaxWidthContent>
      </div>
    </Chrome>
  );
};
