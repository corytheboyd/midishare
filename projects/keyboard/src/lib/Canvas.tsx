import * as React from "react";
import { memo, useEffect, useRef } from "react";
import { Canvas as ThreeCanvas } from "react-three-fiber";
import useMeasure from "react-use-measure";
import mergeRefs from "react-merge-refs";
import { Runtime, RuntimeOptions } from "./Runtime";
import { Scene } from "./Scene";
import { SCALE_RATIO } from "./constants";

interface CanvasProps {
  runtime: Runtime;
  options?: RuntimeOptions;
}

export const Canvas: React.FC<CanvasProps> = memo((props) => {
  const containerRef = useRef<HTMLElement>();
  const [resizeRef, bounds] = useMeasure({ scroll: false });

  useEffect(() => {
    if (bounds.width === 0 || bounds.height === 0) {
      return;
    }

    if (!containerRef.current) {
      return;
    }

    // This magic formula is what adjusts the height of the container to show
    // the entirety of the vertical content as the width of the container
    // changes. It's carefully selected to make sure there is enough padding
    // below the keys to animate them being pressed https://imgur.com/a/6UVOZp0
    containerRef.current.style.height =
      bounds.width * (SCALE_RATIO / 1.73) + "px";
  }, [bounds]);

  return (
    <div
      ref={mergeRefs([containerRef, resizeRef as (el: HTMLElement) => void])}
    >
      <ThreeCanvas
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
        <Scene bounds={bounds} runtime={props.runtime} />
      </ThreeCanvas>
    </div>
  );
});

Canvas.displayName = "Canvas";
