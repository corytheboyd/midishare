import * as React from "react";
import useMeasure from "react-use-measure";
import { useEffect, useRef } from "react";
import mergeRefs from "react-merge-refs";
import { onlyRenderOnceLogger } from "./lib/debug";

export const Container: React.FC = (props) => {
  onlyRenderOnceLogger(Container);

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
      {props.children}
    </section>
  );
};
