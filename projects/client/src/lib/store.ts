import create from "zustand/vanilla";
import createReactHook from "zustand";

export type State = {
  foo: string;
};

export const store = create<State>((get, set) => ({
  foo: "bar",
}));

export const useStore = createReactHook(store);
