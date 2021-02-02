import create, { StoreApi } from "zustand/vanilla";
import produce from "immer";
import { storeLogger } from "./debug";
import { getIndexFromKeyName } from "./convert/getIndexFromKeyName";
import { KeyboardState } from "./types";

/**
 * TODO would need to change if playback speed is adjustable! it could no
 *  longer be static.
 * */
const NEED_RENDER_DELAY = 250;

export function createStore(): StoreApi<KeyboardState> {
  storeLogger("createStore()");

  const store = create<KeyboardState>((set, get) => {
    return {
      keys: new Array(88).fill(0),
      needRender: false,
      sustain: false,
      keyOn: (keyName, velocity) =>
        set(
          produce(get(), (draftState) => {
            const index = getIndexFromKeyName(keyName);
            storeLogger(`keyOn() - keyName: ${keyName} index: ${index}`);
            draftState.keys[index] = velocity;
          })
        ),
      keyOff: (keyName) =>
        set(
          produce(get(), (draftState) => {
            const index = getIndexFromKeyName(keyName);
            storeLogger(`keyOff() - keyName: ${keyName} index: ${index}`);
            draftState.keys[index] = 0;
          })
        ),
      sustainOn: () => {
        set(
          produce(get(), (draftState) => {
            draftState.sustain = true;
          })
        );
      },
      sustainOff: () => {
        set(
          produce(get(), (draftState) => {
            draftState.sustain = false;
          })
        );
      },
    };
  });

  store.subscribe(
    (value) => storeLogger(`keys state changed: ${value}`),
    (state) => state.keys
  );
  store.subscribe(
    (value) => storeLogger(`sustain state changed: ${value}`),
    (state) => state.sustain
  );
  store.subscribe(
    (value) => storeLogger(`needRender state changed: ${value}`),
    (state) => state.needRender
  );

  // TODO it still feels weird that this logic lives in the store itself..but
  //  it's really easy to manage here dude.
  let renderTimeDebounceId: NodeJS.Timeout;
  const renderTimeDebounceFn = () => {
    storeLogger("needRender debounce timer expired");
    store.setState({ needRender: false });
  };
  store.subscribe(
    () => {
      if (renderTimeDebounceId) {
        clearTimeout(renderTimeDebounceId);
      }
      renderTimeDebounceId = setTimeout(
        renderTimeDebounceFn,
        NEED_RENDER_DELAY
      );
      store.setState({ needRender: true });
      storeLogger("needRender debounce timer poked");
    },
    (state) => state.keys
  );
  storeLogger("needRender observer created");

  return store;
}
