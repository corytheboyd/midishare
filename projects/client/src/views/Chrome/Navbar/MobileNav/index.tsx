import React, { useEffect } from "react";
import classNames from "classnames";
import {
  BaseButton,
  BaseButtonProps,
} from "../../../common/buttons/BaseButton";

export const MobileNavMenu: React.FC<{
  open: boolean;
  requestClose: () => void;
}> = (props) => {
  function handleKeyDown(event: KeyboardEvent) {
    if (!props.open) {
      return;
    }

    if (event.code === "Escape") {
      props.requestClose();
    }
  }

  useEffect(() => {
    if (props.open) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [props.open]);

  return (
    <>
      <div
        className={classNames({
          "z-10 absolute top-0 right-0 bg-black w-full h-full opacity-75": true,
          invisible: !props.open,
        })}
        onClick={() => props.requestClose()}
      />
      <div
        className={classNames({
          "z-20 mt-11 absolute top-0 right-0 focus:outline-none bg-gray-700 text-gray-800 w-full opacity-100": true,
          invisible: !props.open,
        })}
      >
        {props.children}
      </div>
    </>
  );
};

export const MobileNavMenuButton: React.FC<
  BaseButtonProps & {
    label: string;
    description?: string;
  }
> = ({ label, description, ...buttonProps }) => {
  return (
    <BaseButton className="bg-gray-800 py-2 text-right pr-2" {...buttonProps}>
      <span className="font-bold text-gray-200">{label}</span>
      {description && <p className="text-xs text-gray-400">{description}</p>}
    </BaseButton>
  );
};
