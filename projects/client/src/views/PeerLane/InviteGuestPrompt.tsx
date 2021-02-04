import React, { RefObject, useMemo, useRef } from "react";
import { UserAdd } from "../common/icons/sm/UserAdd";
import { useStore } from "../../lib/store";
import { ClipboardCopy } from "../common/icons/md/ClipboardCopy";
import { Button } from "../common/Button";
import { Routes } from "../routes";

export const InviteGuestPrompt: React.FC = () => {
  const sessionId = useStore((state) => state.session?.serverSession.id);

  const joinUrl = useMemo(() => {
    if (!sessionId) {
      return "";
    }

    const url = new URL(process.env.PUBLIC_URL as string);
    url.pathname = Routes.SESSION.replace(/:id/, sessionId);
    url.searchParams.append("join", "1");

    return url.toString();
  }, [sessionId]);

  const inputRef = useRef<HTMLInputElement>(null);
  const handleLinkInputClick = () => {
    if (!inputRef.current) {
      console.debug("ref not set");
      return;
    }
    console.debug("hey");
    inputRef.current.select();
  };

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
          <input
            ref={inputRef}
            type="text"
            value={joinUrl}
            className="w-full bg-gray-500 text-white text-xs h-5 rounded-sm px-1"
            onClick={handleLinkInputClick}
          />
          <Button className="flex items-center text-sm space-x-0.5">
            <div className="w-4 h-4">
              <ClipboardCopy />
            </div>
            <span>Copy</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
