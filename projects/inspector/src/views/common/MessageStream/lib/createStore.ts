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

  /**
   * Moves the specified number of messages off of the buffer onto the
   * messages list.
   *
   * If numMessages is 'all', the entire buffer will be shifted.
   *
   * Used in the scrollTo callback of MessageList to shift messages off of the
   * buffer when scrolled to the top, so that it doesn't resume real-time
   * playback until the buffer is emptied.
   * */
  shiftBufferedMessages: (numMessages: number | "all") => void;
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

    shiftBufferedMessages: (numMessages) =>
      set(
        produce(get(), (state) => {
          if (numMessages === "all") {
            numMessages = state.bufferedMessages.length;
          } else if (numMessages > state.bufferedMessages.length) {
            numMessages = state.bufferedMessages.length;
          }
          for (let i = 0; i < numMessages; i++) {
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
            state.bufferedMessages = messages;
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
}
