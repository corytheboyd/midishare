import * as React from "react";
import { ListChildComponentProps } from "react-window";
import { MessageStreamSharedProps, RenderRow } from "./index";

interface MessageRowProps
  extends ListChildComponentProps,
    MessageStreamSharedProps {
  renderRow: RenderRow;
}

export const MessageRow: React.FC<MessageRowProps> = ({
  index,
  style,
  renderRow,
  useStore,
}) => {
  const [message] = useStore(
    // Note: inverts the index to select from the end of the messages list.
    // This is the effective logic to render messages in descending order of
    // receipt.
    (state) => [state.messages[state.messages.length - index - 1], state.live],
    (_, [, live]) => !live
  );

  let backgroundColorClass = "";
  if (index % 2 === 0) {
    backgroundColorClass = "bg-gray-700";
  }

  return (
    <div
      style={style}
      className={`h-full pl-1.5 ${backgroundColorClass} text-gray-300 flex items-center justify-start`}
    >
      {renderRow(message, index)}
    </div>
  );
};
