import * as React from "react";
import { createRef, MutableRefObject, useMemo } from "react";
import { MessageList } from "./MessageList";
import { FixedSizeList } from "react-window";
import { ControlBar } from "./ControlBar";
import {
  createStore,
  MessageStreamState,
  MessageStreamStore,
} from "./lib/createStore";
import create, { UseStore } from "zustand";

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
  renderRow?: RenderRow;
};

const defaultRenderRow = (data) => data;

export const MessageStream: React.FC<MessageStreamProps> = (props) => {
  const { renderRow = defaultRenderRow, storeRef } = props;

  const store = useMemo(() => createStore(), []);
  storeRef.current = store;

  const useStore = useMemo(() => create(store), []);
  const listRef = createRef<FixedSizeList>();

  return (
    <div className="flex flex-col">
      <ControlBar listRef={listRef} useStore={useStore} />
      <MessageList ref={listRef} renderRow={renderRow} useStore={useStore} />
    </div>
  );
};
