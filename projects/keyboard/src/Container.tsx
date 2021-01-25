import * as React from "react";
import useMeasure from "react-use-measure";
import { useEffect, useRef } from "react";
import mergeRefs from "react-merge-refs";
import { KeyboardRuntimeProps } from "./types";

export const Container: React.FC<KeyboardRuntimeProps> = (props) => {
  return (
    <section
      style={{ background: "yellow" }}
      // ref={mergeRefs([sectionRef, resizeRef as (el: HTMLElement) => void])}
    >
      {props.children}
    </section>
  );
};
