import * as React from "react";
import { createRef, useEffect } from "react";
import { useStore } from "./store";
import { MessageList } from "./MessageList";
import { FixedSizeList } from "react-window";
import { ControlBar } from "./ControlBar";

export type RenderRow = (data: unknown) => JSX.Element;

type MessageStreamProps = {
  /**
   * Override the default rendered for messages. Defaults to `data => data`,
   * which for example would just render messages verbatim (perfect for
   * strings, but need to override for objects).
   * */
  renderRow?: RenderRow;
};

const defaultRenderRow = (data) => data;

export const MessageStream: React.FC<MessageStreamProps> = ({
  renderRow = defaultRenderRow,
} = {}) => {
  const listRef = createRef<FixedSizeList>();

  // TODO lol remove, duh. this is just here to contrive lots of messages
  //  being sent to test all of the pause/scroll/magic.
  const addMessage = useStore((state) => state.addMessage);
  useEffect(() => {
    setInterval(
      () => addMessage({ message: "Hello!", timestamp: performance.now() }),
      100
    );
  }, [addMessage]);

  return (
    <div className="flex flex-col">
      <ControlBar listRef={listRef} />
      <MessageList ref={listRef} renderRow={renderRow} />
    </div>
  );
};
