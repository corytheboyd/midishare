import * as React from "react";
import { MutableRefObject } from "react";
import { FixedSizeList } from "react-window";
import { Icon } from "../Icon";
import { MessageStreamSharedProps } from "./index";
import { messageStreamLogger } from "../../../lib/debug";

interface ControlBarProps extends MessageStreamSharedProps {
  listRef: MutableRefObject<FixedSizeList>;
}

export const ControlBar: React.FC<ControlBarProps> = (props) => {
  const live = props.useStore((state) => state.live);
  const setLive = props.useStore((state) => state.setLive);

  const handlePauseClick = () => {
    if (live) {
      messageStreamLogger("Clicked pause button, pause real-time messages");
      setLive(false);
    } else {
      messageStreamLogger(
        "Clicked resume button, resume real-time messages (and scroll to top)"
      );
      if (props.listRef.current) {
        props.listRef.current.scrollToItem(0);
      }
      setLive(true);
    }
  };

  return (
    <div className="bg-gray-300 flex p-1.5 items-center justify-start">
      <button
        onClick={handlePauseClick}
        className="flex justify-center items-center space-x-1 px-1 py-0.5 text-sm bg-gray-400 text-white rounded"
      >
        <Icon name={live ? "pause" : "play"} size="sm" />
        <span>{live ? "Pause" : "Resume"}</span>
      </button>
    </div>
  );
};
