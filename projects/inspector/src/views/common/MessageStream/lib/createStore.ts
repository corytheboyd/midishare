import create, { StoreApi } from "zustand/vanilla";
import produce from "immer";
import { messageStreamLogger } from "../../../../lib/debug";

export type MessageStreamState<T = unknown> = {
  live: boolean;
  setLive: (value: boolean) => void;

  messages: T[];
  bufferedMessages: T[];
  addMessage: (message: T) => void;

  replaceMessages: (messages: T[]) => void;
};

/**
 * This type is generic to allow consumers to create type safe store refs.
 * Internally, all of the typing remains unknown to keep it simple.
 * */
export type MessageStreamStore<T = never> = StoreApi<MessageStreamState<T>>;

export function createStore(): MessageStreamStore<unknown> {
  return create<MessageStreamState<unknown>>((set, get) => ({
    live: true,
    messages: [],
    bufferedMessages: [],

    addMessage: (message) =>
      set(
        produce(get(), (state) => {
          if (state.live) {
            state.messages.push(message);
          } else {
            state.bufferedMessages.push(message);
          }
        })
      ),

    replaceMessages: (messages) =>
      set(
        produce(get(), (state) => {
          if (state.live) {
            state.messages = messages;
            state.bufferedMessages = [];
          } else {
            state.messages = [];
            state.bufferedMessages = messages;
          }
        })
      ),

    setLive: (value) =>
      set(
        produce(get(), (state) => {
          state.live = value;

          // If setting back to live, merge buffered messages into canonical
          // messages list.
          if (state.live && state.bufferedMessages.length > 0) {
            for (const bufferedMessage of state.bufferedMessages) {
              state.messages.push(bufferedMessage);
            }
            state.bufferedMessages = [];
          }
        })
      ),
  }));
}
