import create from "zustand/vanilla";
import createReactHook from "zustand";
import produce from "immer";

type MessageStreamState<MessageType = unknown> = {
  live: boolean;
  messages: MessageType[];
  bufferedMessages: MessageType[];

  addMessage: (message: MessageType) => void;
  setLive: (value: boolean) => void;
};

export const store = create<MessageStreamState>((set, get) => ({
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

export const useStore = createReactHook(store);
