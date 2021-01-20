import * as React from "react";
import { createRef, MutableRefObject, useMemo, useRef } from "react";
import { MessageList } from "./MessageList";
import { FixedSizeList } from "react-window";
import {
  createStore,
  MessageStreamState,
  MessageStreamStore,
} from "./lib/createStore";
import create, { UseStore } from "zustand";
import { messageStreamLogger } from "../../../lib/debug";
import { StatusIndicator } from "../StatusIndicator";

export type RenderRow = (data: unknown, index: number) => JSX.Element;

export type MessageStreamSharedProps = {
  /**
   * React hook of main store for this MessageStream instance. Mostly for
   * convenience, as you could just interact with the vanilla zustand store
   * should you choose.
   *
   * This shouldn't be used externally! Were this to be migrated to a library
   * of its own, this would not be included in the exports.
   * */
  useStore: UseStore<MessageStreamState<unknown>>;
};

type MessageStreamProps = {
  /**
   * Allows controller to mutate the state of the underlying MessageStream.
   * Required, because otherwise there is no point in creating a MessageStream.
   * */
  storeRef: MutableRefObject<MessageStreamStore<unknown>>;

  /**
   * Override the default rendered for messages. Defaults to `data => data`,
   * which for example would just render messages verbatim (perfect for
   * strings, but need to override for objects).
   * */
  renderRow: RenderRow;
};

const ResumeButton: React.FC<
  MessageStreamSharedProps & { onClick: () => void }
> = ({ useStore, onClick }) => {
  const bufferedMessages = useStore((state) => state.bufferedMessages);

  return (
    <button
      className="underline text-blue-500 hover:text-blue-600 focus:ring-0"
      onClick={onClick}
    >
      Resume to see the {bufferedMessages.length} new messages
    </button>
  );
};

export const MessageStream: React.FC<MessageStreamProps> = (props) => {
  const { renderRow, storeRef } = props;

  const store = useMemo(() => createStore(), []);
  storeRef.current = store;

  const useStore = useMemo(() => create(store), []);
  const listRef = useRef<FixedSizeList>();

  const live = useStore((state) => state.live);
  const shiftBufferedMessages = useStore(
    (state) => state.shiftBufferedMessages
  );
  const setLive = useStore((state) => state.setLive);

  return (
    <div className="flex flex-col">
      <div className="flex p-1.5 bg-gray-300 text-gray-500 font-mono text-xs font-light rounded-t">
        <div className="flex items-baseline space-x-1 flex-grow-0">
          <StatusIndicator active={live} color="red" size="xs" />
          <div className="">{live ? "live" : "paused"}</div>
        </div>

        {!live && (
          <div className="text-center w-full flex-grow">
            <div className="space-x-1">
              <span>Real-time messages paused.</span>
              <ResumeButton
                useStore={useStore}
                onClick={() => {
                  shiftBufferedMessages();
                  setLive(true);
                  listRef.current.scrollTo(0);
                }}
              />
            </div>
          </div>
        )}
      </div>
      <MessageList
        ref={listRef}
        onScroll={(scrollProps) => {
          if (!listRef.current || store.getState().messages.length === 0) {
            return;
          }

          if (
            scrollProps.scrollDirection == "forward" &&
            store.getState().live
          ) {
            messageStreamLogger("Scrolled down, pause real-time messages");
            store.getState().setLive(false);
          }
        }}
        renderRow={renderRow}
        useStore={useStore}
      />
    </div>
  );
};
