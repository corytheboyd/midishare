import * as React from "react";
import useMeasure from "react-use-measure";
import { useEffect, useRef, useState } from "react";
import mergeRefs from "react-merge-refs";
import { KeyboardRuntimeProps } from "./types";
import { isKeyboardGeometryLoaded, preloadAssets } from "./lib/assets";
import { LoadingState } from "./LoadingState";

const MINIMUM_LOAD_TIME_MS = 500;

export const Container: React.FC<KeyboardRuntimeProps> = (props) => {
  const [assetsLoaded, setAssetsLoaded] = useState(
    !!isKeyboardGeometryLoaded()
  );
  useEffect(() => {
    const startTime = performance.now();
    preloadAssets().then(() => {
      const elapsedTime = performance.now() - startTime;
      if (elapsedTime < MINIMUM_LOAD_TIME_MS) {
        setTimeout(
          () => setAssetsLoaded(true),
          MINIMUM_LOAD_TIME_MS - elapsedTime
        );
      } else {
        setAssetsLoaded(true);
      }
    });
  }, []);

  const sectionRef = useRef<HTMLElement>();
  const [resizeRef, bounds] = useMeasure({ scroll: false });
  useEffect(() => {
    if (bounds.width > 0 && sectionRef.current) {
      // Maintain dimensions that fit the keyboard based on the width of the viewport.
      sectionRef.current.style.height = bounds.width * 0.12658 + "px";
    }
  }, [bounds.width, resizeRef]);

  return (
    <section
      ref={mergeRefs([sectionRef, resizeRef as (el: HTMLElement) => void])}
    >
      {assetsLoaded ? props.children : <LoadingState />}
    </section>
  );
};
