import React, { useEffect, useMemo, useRef, useState } from "react";
import { UserAdd } from "../common/icons/sm/UserAdd";
import { useStore } from "../../lib/store";
import { ClipboardCopy } from "../common/icons/md/ClipboardCopy";
import { Button } from "../common/Button";
import { Routes } from "../routes";
import { Check } from "../common/icons/sm/Check";
import { ExclamationCircle } from "../common/icons/sm/ExclamationCircle";
import ClipboardJS from "clipboard";

const CopyTextButton: React.FC<{
  /**
   * The ID of the CopyTargetInput
   * */
  clipboardId: string;
}> = (props) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [status, setStatus] = useState<"default" | "success" | "error">(
    "default"
  );

  useEffect(() => {
    if (!buttonRef.current) {
      return;
    }
    // const clipboard = new ClipboardJS(".copy-text-button");
    const clipboard = new ClipboardJS(buttonRef.current);
    console.debug("clipboard", clipboard);

    clipboard.on("success", () => {
      setStatus("success");
      setTimeout(() => setStatus("default"), 2000);
    });

    clipboard.on("error", () => {
      setStatus("error");
      setTimeout(() => setStatus("default"), 2000);
    });

    return () => clipboard.destroy();
  }, []);

  let icon: JSX.Element;
  let iconColor: string | undefined;
  if (status === "default") {
    icon = <ClipboardCopy />;
  } else if (status === "success") {
    icon = <Check />;
    iconColor = "green";
  } else {
    icon = <ExclamationCircle />;
    iconColor = "red";
  }

  return (
    <Button
      ref={buttonRef}
      className="flex items-center text-sm space-x-0.5"
      disabled={status !== "default"}
      data-clipboard-action="copy"
      data-clipboard-target={`#${props.clipboardId}`}
    >
      <span className="transition-all"></span>
      <div
        className={`w-4 h-4 transition ${iconColor && `text-${iconColor}-500`}`}
      >
        {icon}
      </div>
    </Button>
  );
};

const CopyTextInput: React.FC<{
  /**
   * The source data to be copied
   * */
  source: string;

  /**
   * The ID of this target to use with CopyTargetButton
   * */
  clipboardId?: string;
}> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLinkInputClick = () => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.select();
  };

  const optionalProps: React.InputHTMLAttributes<HTMLInputElement> = {};
  if (props.clipboardId) {
    optionalProps.id = props.clipboardId;
  }

  return (
    <input
      {...optionalProps}
      ref={inputRef}
      type="text"
      value={props.source}
      className="w-full bg-gray-500 text-white text-xs h-5 rounded-sm px-1"
      onClick={handleLinkInputClick}
    />
  );
};

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
