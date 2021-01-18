import * as React from "react";
import { Component, createRef, useEffect } from "react";
import { useStore } from "./store";
import { MessageList } from "./MessageList";
import { FixedSizeList } from "react-window";

export const MessageStream: React.FC = () => {
  const listRef = createRef<FixedSizeList>();

  const addMessage = useStore((state) => state.addMessage);
  const live = useStore((state) => state.live);
  const setLive = useStore((state) => state.setLive);

  useEffect(() => {
    setInterval(() => addMessage(), 100);
  }, [addMessage]);

  const handlePauseClick = () => {
    if (live) {
      setLive(false);
    } else {
      if (listRef.current) {
        listRef.current.scrollToItem(0);
      }
      setLive(true);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="bg-gray-300 h-10 p-1">
        <button onClick={handlePauseClick}>{live ? "pause" : "live"}</button>
      </div>
      <MessageList ref={listRef} />
    </div>
  );
};
