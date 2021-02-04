import React, { useEffect, useRef, useState } from "react";
import ClipboardJS from "clipboard";
import { ClipboardCopy } from "./icons/md/ClipboardCopy";
import { Check } from "./icons/sm/Check";
import { ExclamationCircle } from "./icons/sm/ExclamationCircle";
import { Button } from "./Button";

export const CopyTextButton: React.FC<{
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
