import create, { StoreApi } from "zustand/vanilla";
import produce from "immer";

export type MessageStreamState<T = never> = {
  live: boolean;
  setLive: (value: boolean) => void;

  messages: T[];
  bufferedMessages: T[];
  addMessage: (message: T) => void;
};

export type MessageStreamStore<T = never> = StoreApi<MessageStreamState<T>>;

export function createStore<T>(): MessageStreamStore<T> {
  return create<MessageStreamState<T>>((set, get) => ({
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
