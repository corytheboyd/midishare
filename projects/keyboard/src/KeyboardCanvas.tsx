import * as React from "react";
import { Canvas } from "react-three-fiber";
import { onlyRenderOnceLogger } from "./lib/debug";
import { KeyboardRuntimeProps } from "./types";

export const KeyboardCanvas: React.FC<KeyboardRuntimeProps> = (props) => {
  onlyRenderOnceLogger(KeyboardCanvas);

  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      resize={{ scroll: false, debounce: 250 }}
      pixelRatio={window.devicePixelRatio}
      camera={{
        near: 0,
        far: 2000,
        // position: [0, 0, 0],
        // position: [0, 62.589, 75.926],
        // rotation: [-0.68, 0, 0],
      }}
      orthographic={true}
      invalidateFrameloop={true}
    >
      {props.children}
    </Canvas>
  );
};
