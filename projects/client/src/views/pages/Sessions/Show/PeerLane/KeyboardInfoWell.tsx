import React, { useState } from "react";
import classnames from "classnames";

const pedImageUrl = (() => {
  const url = new URL(process.env.PUBLIC_CDN_URL as string);
  url.pathname = "/ped.png";
  return url.toString();
})();

export const KeyboardInfoWell: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      className={classnames(
        "bg-yellow-100 p-1 rounded-full shadow-lg transition-all",
        {
          "opacity-25": !isPressed,
          "shadow-sm": isPressed,
          "animate-pulse": isPressed,
        }
      )}
      onClick={() => {
        setIsPressed(!isPressed);
      }}
    >
      <img className="h-10" src={pedImageUrl} alt="Pedal symbol" />
    </div>
  );
};
