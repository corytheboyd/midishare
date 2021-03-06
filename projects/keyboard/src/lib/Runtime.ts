import { StoreApi } from "zustand/vanilla";
import { runtimeLogger } from "./debug";
import { Color } from "three";
import { KeyboardState, KeyName } from "./types";
import create, { UseStore } from "zustand";

export interface RuntimeOptions {
  /**
   * Root URL of the assets. Right now, this is Cory Knowledge Only, but that
   * can be generalized in the future. Also, might not even need assets
   * anymore if/when I replace the model with raw geometries in code.
   * */
  assetPath: string;

  /**
   * When a key is engaged, use a color to effectively increase the contrast
   * of notes in play. By default, no color applied.
   *
   * Note: At play time, the intensity of this color will automatically be
   * influenced by the note velocity.
   *
   * This value can be anything that the three.js Color constructor accepts.
   * See: https://threejs.org/docs/index.html#api/en/math/Color
   * */
  keyPressedColor?: string | number;
}

export class Runtime {
  public readonly assetPath: string;
  public readonly keyPressedColor?: Color;
  public readonly useStore: UseStore<KeyboardState>;

  private readonly store: StoreApi<KeyboardState>;
  private onReadyCallbacks: (() => void)[] = [];
  private onNeedRenderCallbacks: (() => void)[] = [];

  constructor(store: StoreApi<KeyboardState>, options: RuntimeOptions) {
    this.assetPath = options.assetPath;

    if (options.keyPressedColor) {
      this.keyPressedColor = new Color(options.keyPressedColor);
    }

    this.store = store;
    this.useStore = create(store);

    this.store.subscribe(
      (value: boolean, previousValue: boolean) => {
        if (value && !previousValue) {
          this.executeOnNeedRenderCallbacks();
        }
      },
      (state) => state.needRender
    );
  }

  /**
   * Engage the key at the given velocity
   * */
  public keyOn(keyName: KeyName, velocity: number): void {
    runtimeLogger(`keyOn(keyName: ${keyName}, velocity: ${velocity})`);
    this.store.getState().keyOn(keyName, velocity);
  }

  /**
   * Disengage the key
   * */
  public keyOff(keyName: KeyName): void {
    runtimeLogger(`keyOff(keyName: ${keyName})`);
    this.store.getState().keyOff(keyName);
  }

  /**
   * Engage the sustain pedal
   * */
  public sustainOn(): void {
    runtimeLogger("sustainOn()");
    this.store.getState().sustainOn();
  }

  /**
   * Disengage the sustain pedal
   * */
  public sustainOff(): void {
    runtimeLogger("sustainOff()");
    this.store.getState().sustainOff();
  }

  /**
   * True when the Canvas needs animation, otherwise false
   * */
  public get needRender(): boolean {
    return this.store.getState().needRender;
  }

  /**
   * Exposes pressed state of keys. Values of 0 mean the key is not pressed.
   * */
  public get keys(): number[] {
    return this.store.getState().keys;
  }

  /**
   * Registers callback function to be executed after the Canvas is ready to
   * receive input.
   * */
  public onReady(callback: () => void): void {
    runtimeLogger(
      `register onReady callback: ${callback.name || "(anonymous)"}`
    );
    this.onReadyCallbacks.push(callback);
  }

  /**
   * Registers callback function to be executed when the Canvas needs to be
   * rendered. Used internally to invalidate the three.js render loop as keys state
   * changes.
   * */
  public onNeedRender(callback: () => void): void {
    runtimeLogger(
      `register onNeedRender callback: ${callback.name || "(anonymous)"}`
    );
    this.onNeedRenderCallbacks.push(callback);
  }

  /**
   * For internal use only.
   * */
  public setIsReady(): void {
    runtimeLogger("setIsReady() called");
    this.executeOnReadyCallbacks();
  }

  private executeOnReadyCallbacks(): void {
    runtimeLogger("execute onReady callbacks");
    this.onReadyCallbacks.forEach((cb) => cb());
  }

  private executeOnNeedRenderCallbacks(): void {
    runtimeLogger("execute onNeedRender callbacks");
    this.onNeedRenderCallbacks.forEach((cb) => cb());
  }
}
