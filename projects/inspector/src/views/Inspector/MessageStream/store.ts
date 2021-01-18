import create from "zustand/vanilla";
import createReactHook from "zustand";
import produce from "immer";

type MessageStreamState = {
  live: boolean;
  messages: string[];
  bufferedMessages: string[];

  addMessage: () => void;
  setLive: (value: boolean) => void;
};

export const store = create<MessageStreamState>((set, get) => ({
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

export const useStore = createReactHook(store);
