import React, { useCallback } from "react";
import classnames from "classnames";
import { PeerLaneProps } from "./index";
import { useStore } from "../../../../../lib/store";

const pedImageUrl = (() => {
  const url = new URL(process.env.STATIC_CDN_URL as string);
  url.pathname = "/ped.png";
  return url.toString();
})();

export const KeyboardInfoWell: React.FC<PeerLaneProps> = (props) => {
  const isPressed = props.runtime.useStore((state) => state.sustain);
  const isSustainInverted = useStore((state) => state.sustainInverted);
  const setSustainInverted = useStore((state) => state.setSustainInverted);

  const handleInvertSustain = useCallback(() => {
    console.debug("toggleSustainInverted");
    setSustainInverted(!isSustainInverted);
  }, [setSustainInverted, isSustainInverted]);

  return (
    <div
      className={classnames(
        "bg-yellow-100 p-1 rounded-full shadow-lg transition-all",
        {
          "cursor-pointer": props.isLocal,
          "opacity-25": !isPressed,
          "shadow-sm": isPressed,
        }
      )}
      onClick={handleInvertSustain}
    >
      <img className="h-10" src={pedImageUrl} alt="Pedal symbol" />
    </div>
  );
};
