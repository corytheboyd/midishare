import * as React from "react";
import { FixedSizeList, ListOnScrollProps } from "react-window";
import { MessageRow } from "./MessageRow";
import { forwardRef } from "react";
import { MessageStreamSharedProps, RenderRow } from "./index";

interface MessageListProps extends MessageStreamSharedProps {
  onScroll: (props: ListOnScrollProps) => void;
  renderRow: RenderRow;
}

export const MessageList = forwardRef<FixedSizeList, MessageListProps>(
  (props, forwardRef) => {
    const messageCount = props.useStore((state) => state.messages.length);

    const rowHeight = 25;
    const numRows = 25;

    return (
      <FixedSizeList
        ref={forwardRef}
        className="bg-gray-800 font-mono text-sm h-96"
        layout="vertical"
        height={rowHeight * numRows}
        width="100%"
        itemCount={messageCount}
        itemSize={rowHeight}
        onScroll={props.onScroll}
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
