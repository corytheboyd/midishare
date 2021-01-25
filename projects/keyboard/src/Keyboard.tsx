import * as React from "react";
import { Runtime } from "./lib/Runtime";
import { memo, useEffect, useRef } from "react";
import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "react-three-fiber";
import useMeasure from "react-use-measure";
import mergeRefs from "react-merge-refs";
import { Model } from "./gen/Model";

interface KeyboardProps {
  /**
   * The runtime to use for this Keyboard instance.
   * */
  runtime: Runtime;
}

export const Keyboard: React.FC<KeyboardProps> = memo((props) => {
  // TODO will get to you, my friend
  const runtimeRef = useRef(props.runtime);

  const sectionRef = useRef<HTMLElement>();
  const [resizeRef, bounds] = useMeasure({ scroll: false });
  useEffect(() => {
    if (bounds.width > 0 && sectionRef.current) {
      // Maintain dimensions that fit the keyboard based on the width of the viewport.
      sectionRef.current.style.height = bounds.width * 0.12658 + "px";
    }
  }, [bounds.width, resizeRef]);

  if (!props.runtime) {
    throw new Error(
      "Must instantiate runtime and provide through the Keyboard props API"
    );
  }

  return (
    <section
      style={{ background: "black" }}
      ref={mergeRefs([sectionRef, resizeRef as (el: HTMLElement) => void])}
    >
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        // resize={{ scroll: false, debounce: 250 }}
        pixelRatio={window.devicePixelRatio}
        camera={{
          zoom: 100,
          position: [0, 1, 0],
          rotation: [0, 0, 0],
        }}
        orthographic={true}
        invalidateFrameloop={true}
      >
        <Stats />
        <OrbitControls />

        <pointLight position={[0, 8, -3]} power={30} color="#FFFAD6" />

        <React.Suspense fallback={null}>
          <Model />
        </React.Suspense>
      </Canvas>
    </section>
  );
});

Keyboard.displayName = "Keyboard";
