import create, { StoreApi } from "zustand/vanilla";
import produce from "immer";

export type MessageStreamState<T = unknown> = {
  live: boolean;
  setLive: (value: boolean) => void;

  messages: T[];
  bufferedMessages: T[];
  addMessage: (message: T) => void;

  replaceMessages: (messages: T[]) => void;

  /**
   * Moves all messages off of the buffer and onto the messages list.
   * */
  shiftBufferedMessages: () => void;
};

/**
 * This type is generic to allow consumers to create type safe store refs.
 * Internally, all of the typing remains unknown to keep it simple.
 * */
export type MessageStreamStore<T = never> = StoreApi<MessageStreamState<T>>;

export function createStore(): MessageStreamStore<unknown> {
  const store = create<MessageStreamState<unknown>>((set, get) => ({
    live: true,
    messages: [],
    bufferedMessages: [],

    shiftBufferedMessages: () =>
      set(
        produce(get(), (state) => {
          while (state.bufferedMessages.length > 0) {
            state.messages.push(state.bufferedMessages.shift());
          }
        })
      ),

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
          } else {
            state.bufferedMessages = messages.slice(state.messages.length - 1);
          }
        })
      ),

    setLive: (value) =>
      set(
        produce(get(), (state) => {
          state.live = value;
        })
      ),
  }));

  return store;
}
