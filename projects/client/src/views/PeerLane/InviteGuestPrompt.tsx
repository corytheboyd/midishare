import React, { useMemo } from "react";
import { UserAdd } from "../common/icons/sm/UserAdd";
import { useStore } from "../../lib/store";
import { Routes } from "../routes";
import { CopyTextInput } from "../common/CopyTextInput";
import { CopyTextButton } from "../common/CopyTextButton";

export const InviteGuestPrompt: React.FC = () => {
  const sessionId = useStore((state) => state.session?.id);

  const joinUrl = useMemo(() => {
    if (!sessionId) {
      return "";
    }

    const url = new URL(process.env.PUBLIC_URL as string);
    url.pathname = Routes.SESSION_JOIN.replace(/:id/, sessionId);

    return url.toString();
  }, [sessionId]);

  return (
    <div className="flex items-center space-x-1">
      <div className="w-96 flex flex-col items-center text-center space-y-3 p-3">
        <div className="h-10 w-10">
          <UserAdd />
        </div>

        <p className="text-sm">
          Send this link to the person you want to join, and they will
          automatically be paired with you here!
        </p>

        <div className="flex items-center space-x-2 w-full">
          <CopyTextInput source={joinUrl} clipboardId="joinUrl" />
          <CopyTextButton clipboardId="joinUrl" />
        </div>
      </div>
    </div>
  );
};