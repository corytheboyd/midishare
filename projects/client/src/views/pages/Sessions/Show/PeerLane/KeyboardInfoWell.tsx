import React from "react";
import classnames from "classnames";
import { PeerLaneProps } from "./index";

const pedImageUrl = (() => {
  const url = new URL(process.env.STATIC_CDN_URL as string);
  url.pathname = "/ped.png";
  return url.toString();
})();

export const KeyboardInfoWell: React.FC<PeerLaneProps> = (props) => {
  const isPressed = props.runtime.useStore((store) => store.sustain);

  return (
    <div
      className={classnames(
        "bg-yellow-100 p-1 rounded-full shadow-lg transition-all",
        {
          "opacity-25": !isPressed,
          "shadow-sm": isPressed,
        }
      )}
    >
      <img className="h-10" src={pedImageUrl} alt="Pedal symbol" />
    </div>
  );
};
