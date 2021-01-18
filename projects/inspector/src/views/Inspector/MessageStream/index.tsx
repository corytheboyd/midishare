import * as React from "react";
import { useEffect } from "react";
import create from "zustand";
import produce from "immer";
import { FixedSizeList, ListChildComponentProps } from "react-window";

type MessageStreamState = {
  live: boolean;
  messages: string[];
  bufferedMessages: string[];

  addMessage: () => void;
  setLive: (value: boolean) => void;
};

const useState = create<MessageStreamState>((set, get) => ({
  live: true,
  messages: [],
  bufferedMessages: [],

  addMessage: () =>
    set(
      produce(get(), (state) => {
        // TODO of course, allow messages to be passed in. this is for rapid
        //  development only.
        const message = `message ${
          state.messages.length + state.bufferedMessages.length
        }`;

        if (state.live) {
          state.messages.push(message);
        } else {
          state.bufferedMessages.push(message);
        }
      })
    ),

  setLive: (value) =>
    set(
      produce(get(), (state) => {
        state.live = value;

        // If setting back to live, merge buffered messages into canonical
        // messages list.
        // TODO Maybe there is a more efficient way of doing this than
        //  iterate + unshift, revisit
        if (state.live && state.bufferedMessages.length > 0) {
          for (const bufferedMessage of state.bufferedMessages) {
            state.messages.push(bufferedMessage);
          }
          state.bufferedMessages = [];
        }
      })
    ),
}));

const MessageRow: React.FC<ListChildComponentProps> = ({ index, style }) => {
  const [message] = useState(
    // Note: inverts the index to select from the end of the messages list.
    // This is the effective logic to render messages in descending order of
    // receipt.
    (state) => [state.messages[state.messages.length - index - 1], state.live],
    (_, [, live]) => !live
  );

  let backgroundColorClass: string;
  if (index % 2 === 0) {
    backgroundColorClass = "bg-yellow-50";
  } else {
    backgroundColorClass = "bg-yellow-100";
  }

  return (
    <div
      style={style}
      className={`h-full pl-1.5 ${backgroundColorClass} text-gray-800 flex items-center justify-start`}
    >
      {message}
    </div>
  );
};

const MessageList: React.FC = () => {
  const setLive = useState((state) => state.setLive);
  const [messageCount] = useState(
    (state) => [state.messages.length, state.live]
    // (_, [, live]) => !live
  );

  const rowHeight = 20;

  return (
    <FixedSizeList
      className="bg-gray-500 font-mono text-sm h-96"
      layout="vertical"
      height={400}
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
      {MessageRow}
    </FixedSizeList>
  );
};

export const MessageStream: React.FC = () => {
  const addMessage = useState((state) => state.addMessage);

  useEffect(() => {
    setInterval(() => addMessage(), 10);
  }, [addMessage]);

  return (
    <div className="bg-gray-800 text-gray-300 flex flex-col">
      <div className="h-full">
        <MessageList />
      </div>
    </div>
  );
};
