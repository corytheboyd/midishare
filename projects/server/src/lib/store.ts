import create from "zustand/vanilla";
import produce from "immer";

type Session = {
  id: string;
};

type AppState = {
  sessions: Record<string, Session>;
  addSession: (session: Session) => void;
};

/**
 * In lieu of a long term database, state is kept in-memory. Zustand is
 * technically geared towards client-side development, but hey, it's really
 * good at what it does, why not use as a light wrapper on the server too?
 * This is very likely a temporary stand-in anyway.
 *
 * In-memory would very quickly fall apart were the server to be scaled
 * horizontally, without some annoyingly careful session affinity, so will
 * definitely want to rip it out by then anyway.
 * */
export const store = create<AppState>((set, get) => ({
  sessions: {},
  addSession: (session) =>
    set(
      produce(get(), (state) => {
        state.sessions[session.id] = session;
      })
    ),
}));
