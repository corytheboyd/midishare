import create from "zustand/vanilla";
import createReactHook from "zustand";
import { Input } from "webmidi";
import produce from "immer";
import { createRuntime, Runtime } from "@midishare/keyboard";
import { PROTECTED_CDN_URL } from "./constants";

type SessionState = {
  localKeyboardRuntime: Runtime;
  remoteKeyboardRuntime: Runtime;
};

export type State = {
  /**
   * Initial state is null to indicate that access has not been asked for yet.
   * */
  midiAccessGranted: boolean | null;
  setMidiAccessGranted: (value: boolean) => void;

  /**
   * Synced MIDI input devices. Event handlers are registered after
   * requesting MIDI access to keep this in sync as devices are
   * connected/disconnected.
   * */
  midiInputDevices: Input[];
  addMidiInputDevice: (input: Input) => void;
  removeMidiInputDevice: (inputId: string) => void;

  /**
   * The currently selected MIDI input device, initially set to null.
   *
   * TODO make it sticky so that the user doesn't have to constantly reselect
   * */
  activeMidiInputDeviceId: string | null;
  setActiveMidiInputDeviceId: (inputId: string) => void;

  /**
   * Global state for the active Session.
   * */
  session?: SessionState;
  createSession: () => void;
};

export const store = create<State>((set, get) => ({
  midiAccessGranted: null,
  midiInputDevices: [],
  activeMidiInputDeviceId: null,
  setMidiAccessGranted: (value) =>
    set(
      produce(get(), (state) => {
        state.midiAccessGranted = value;
      })
    ),
  addMidiInputDevice: (input) =>
    set(
      produce(get(), (state) => {
        if (state.midiInputDevices.indexOf(input) === -1) {
          state.midiInputDevices.push(input);
        }
      })
    ),
  removeMidiInputDevice: (inputId) =>
    set(
      produce(get(), (state) => {
        state.midiInputDevices = state.midiInputDevices.filter(
          (input) => input.id !== inputId
        );
      })
    ),
  setActiveMidiInputDeviceId: (inputId) =>
    set(
      produce(get(), (state) => {
        state.activeMidiInputDeviceId = inputId;
      })
    ),
  createSession: () =>
    set(
      produce(get(), (state) => {
        state.session = {
          localKeyboardRuntime: createRuntime({
            assetPath: PROTECTED_CDN_URL,
            keyPressedColor: "blue",
          }),
          remoteKeyboardRuntime: createRuntime({
            assetPath: PROTECTED_CDN_URL,
            keyPressedColor: "yellow",
          }),
        };
      })
    ),
}));

export const useStore = createReactHook(store);
