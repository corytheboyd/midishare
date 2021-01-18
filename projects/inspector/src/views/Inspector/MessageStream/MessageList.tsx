import * as React from "react";
import { FixedSizeList } from "react-window";
import { MessageRow } from "./MessageRow";
import { forwardRef, MutableRefObject } from "react";
import { MessageStreamSharedProps, RenderRow } from "./index";

interface MessageListProps extends MessageStreamSharedProps {
  /**
   * Optional mutable reference to control the underlying react-window List
   * component.
   *
   * @see https://react-window.now.sh/#/examples/list/scroll-to-item
   * */
  listRef?: MutableRefObject<FixedSizeList>;

  renderRow: RenderRow;
}

export const MessageList = forwardRef<FixedSizeList, MessageListProps>(
  (props, ref) => {
    const setLive = props.useStore((state) => state.setLive);
    const messageCount = props.useStore((state) => state.messages.length);
    const rowHeight = 25;
    const numRows = 25;

    return (
      <FixedSizeList
        ref={ref}
        className="bg-gray-800 font-mono text-sm h-96"
        layout="vertical"
        height={rowHeight * numRows}
        width="100%"
        itemCount={messageCount}
        itemSize={rowHeight}
        onScroll={(props) => {
          if (props.scrollOffset === 0) {
            setLive(true);
          } else {
            setLive(false);
          }
        }}
      >
        {(renderFnProps) => {
          return (
            <MessageRow
              {...renderFnProps}
              renderRow={props.renderRow}
              useStore={props.useStore}
            />
          );
        }}
      </FixedSizeList>
    );
  }
);

MessageList.displayName = "MessageList";
