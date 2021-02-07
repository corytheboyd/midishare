import React from "react";
import { PeerLaneProps } from "./index";

export const VideoWell: React.FC<PeerLaneProps> = (props) => {
  return (
    <div className="flex-auto flex flex-col justify-center items-center shadow-md">
      <div className="w-full flex-auto bg-gray-800 rounded-t"></div>
      <div className="w-full h-7 flex-grow-0 bg-gray-500 rounded-b"></div>
    </div>
  );
};
