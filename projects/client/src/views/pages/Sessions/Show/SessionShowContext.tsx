import { createContext } from "react";
import { Session, SessionRuntimeOptions, UserProfile } from "@midishare/common";
import { Runtime } from "@midishare/keyboard";
import { store } from "../../../../lib/store";

export type ISessionShowContext = {
  currentUser?: UserProfile | null;
  session?: Session | null;
  isHost?: boolean;
  localRuntime?: Runtime;
  remoteRuntime?: Runtime;
  localRuntimeOptions?: SessionRuntimeOptions;
  remoteRuntimeOptions?: SessionRuntimeOptions;
};

export const SessionShowContext = createContext<ISessionShowContext>({});

/**
 * @note Calling this without the currentUser and/or session keys will still
 *  create a context, one
 *
 * @note Do not use React hooks in this function for now, as it is also used
 *  outside of the React context. Maybe that is a huge smell anyway, might
 *  revisit this approach.
 * */
export function buildSessionShowContext(
  options: Pick<ISessionShowContext, "currentUser" | "session">
): ISessionShowContext {
  const isHost = (() => {
    // If we know user is not logged in, they are always the guest
    if (options.currentUser === null) {
      return false;
    }

    // Waiting for currentUser and/or session to resolve, indeterminate
    if (!options.currentUser || !options.session) {
      return undefined;
    }

    return options.currentUser.sub === options.session.participants.host;
  })();

  const localRuntime = store.getState().runtime?.localKeyboardRuntime;
  const remoteRuntime = store.getState().runtime?.remoteKeyboardRuntime;

  const localRuntimeOptions = (() => {
    if (!options.session || isHost === undefined) {
      return undefined;
    }
    return options.session.runtimeOptions[isHost ? "host" : "guest"];
  })();

  const remoteRuntimeOptions = (() => {
    if (!options.session || isHost === undefined) {
      return undefined;
    }
    return options.session.runtimeOptions[isHost ? "guest" : "host"];
  })();

  return {
    currentUser: options.currentUser,
    session: options.session,
    localRuntime,
    remoteRuntime,
    localRuntimeOptions,
    remoteRuntimeOptions,
    isHost, // computed
  };
}
