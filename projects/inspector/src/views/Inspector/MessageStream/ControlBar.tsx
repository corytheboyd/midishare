import * as React from "react";
import { useStore } from "./store";
import { MutableRefObject } from "react";
import { FixedSizeList } from "react-window";
import { Icon } from "../../common/Icon";

type ControlBarProps = {
  listRef: MutableRefObject<FixedSizeList>;
};

export const ControlBar: React.FC<ControlBarProps> = (props) => {
  const live = useStore((state) => state.live);
  const setLive = useStore((state) => state.setLive);

  const handlePauseClick = () => {
    if (live) {
      setLive(false);
    } else {
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
        className="flex justify-center items-center space-x-1 px-1 py-0.5 text-sm bg-blue-500 text-white rounded"
      >
        <Icon name={live ? "pause" : "play"} size="sm" />
        <span>{live ? "Pause" : "Play"}</span>
      </button>
    </div>
  );
};
