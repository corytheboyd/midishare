import * as React from "react";
import { memo, useEffect, useRef } from "react";
import { Canvas } from "react-three-fiber";
import useMeasure from "react-use-measure";
import { OrbitControls, Stats } from "@react-three/drei";
import mergeRefs from "react-merge-refs";
import { Runtime } from "./Runtime";
import { Scene } from "./Scene";

interface KeyboardProps {
  /**
   * The runtime to use for this Keyboard instance.
   * */
  runtime: Runtime;
}

// Used to calculate new scale of the model as viewport size changes the
// orthographic camera box. It was derived from lazy trial/error to find a
// single scale value (S) that fills the full width of a known container
// width (W), giving us the formula: R = S/W, where R is this constant. The
// values used were W=1205(px), S=275, and then +/- 0.0001 units at a time
// until it fit the width exactly. Dumb? Sure. Works perfectly? Yes.
export const SCALE_RATIO = 0.2282;

export const Keyboard: React.FC<KeyboardProps> = memo((props) => {
  if (!props.runtime) {
    throw new Error(
      "Must instantiate runtime and provide through the Keyboard props API"
    );
  }
  // TODO will get to you, my friend
  const runtimeRef = useRef(props.runtime);

  const containerRef = useRef<HTMLElement>();
  const [resizeRef, bounds] = useMeasure({ scroll: false });

  useEffect(() => {
    if (bounds.width === 0 || bounds.height === 0) {
      return;
    }

    // This magic formula is what adjusts the height of the container to show
    // the entirety of the vertical content as the width of the container
    // changes. It's carefully selected to make sure there is enough padding
    // below the keys to animate them being pressed https://imgur.com/a/6UVOZp0
    containerRef.current.style.height =
      bounds.width * (SCALE_RATIO / 1.83) + "px";
  }, [bounds]);

  return (
    <div ref={mergeRefs([resizeRef, containerRef])}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{
          position: [0, 1, 0.75],
          near: -1000,
          far: 1000,
        }}
        pixelRatio={2}
        orthographic={true}
        invalidateFrameloop={true}
        updateDefaultCamera={true}
      >
        <Scene bounds={bounds} runtimeRef={runtimeRef} />
      </Canvas>
    </div>
  );
});

Keyboard.displayName = "Keyboard";
