import * as React from "react";
import { Container } from "./Container";
import { KeyboardCanvas } from "./KeyboardCanvas";
import { KeyboardScene } from "./KeyboardScene";
import { Runtime } from "./lib/Runtime";
import { memo, useEffect, useRef } from "react";
import { onlyRenderOnceLogger } from "./lib/debug";
import Model from "./gen/Model";
import { OrbitControls, Stats } from "@react-three/drei";
import { Flex, Box, useReflow } from "@react-three/flex";
import { Canvas } from "react-three-fiber";
import useMeasure from "react-use-measure";

interface KeyboardProps {
  /**
   * The runtime to use for this Keyboard instance.
   * */
  runtime: Runtime;
}

export const Keyboard: React.FC<KeyboardProps> = memo((props) => {
  const sectionRef = useRef<HTMLElement>();
  const [resizeRef, bounds] = useMeasure({ scroll: false });
  useEffect(() => {
    if (bounds.width > 0 && sectionRef.current) {
      // Maintain dimensions that fit the keyboard based on the width of the viewport.
      sectionRef.current.style.height = bounds.width * 0.12658 + "px";
    }
  }, [bounds.width, resizeRef]);

  const runtimeRef = useRef(props.runtime);

  if (!props.runtime) {
    throw new Error(
      "Must instantiate runtime and provide through the Keyboard props API"
    );
  }

  return (
    <Container runtimeRef={runtimeRef}>
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
          position: [0, 1, 1],
          rotation: [0, 0, 0],
        }}
        orthographic={true}
        invalidateFrameloop={true}
      >
        <Stats />
        <OrbitControls />

        <pointLight position={[0, 10, 2]} power={10} color="yellow" />

        <React.Suspense fallback={null}>
          <Model />
        </React.Suspense>
      </Canvas>
    </Container>
  );
});

Keyboard.displayName = "Keyboard";
