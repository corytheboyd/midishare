import * as React from "react";
import { createRef, useEffect } from "react";
import { useStore } from "./store";
import { MessageList } from "./MessageList";
import { FixedSizeList } from "react-window";
import { ControlBar } from "./ControlBar";

export const MessageStream: React.FC = () => {
  const listRef = createRef<FixedSizeList>();

  // TODO lol remove, duh. this is just here to contrive lots of messages
  //  being sent to test all of the pause/scroll/magic.
  const addMessage = useStore((state) => state.addMessage);
  useEffect(() => {
    setInterval(() => addMessage(), 100);
  }, [addMessage]);

  return (
    <div className="flex flex-col">
      <ControlBar listRef={listRef} />
      <MessageList ref={listRef} />
    </div>
  );
};
