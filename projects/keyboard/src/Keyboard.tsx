import * as React from "react";
import { Container } from "./Container";
import { KeyboardCanvas } from "./KeyboardCanvas";
import { KeyboardScene } from "./KeyboardScene";
import { KeyboardObject } from "./KeyboardObject";
import { Runtime } from "./lib/Runtime";
import { memo, useRef } from "react";
import { onlyRenderOnceLogger } from "./lib/debug";
import Model from "./gen/Keyboard";

interface KeyboardProps {
  /**
   * The runtime to use for this Keyboard instance.
   * */
  runtime: Runtime;
}

export const Keyboard: React.FC<KeyboardProps> = memo((props) => {
  onlyRenderOnceLogger(Keyboard);

  const runtimeRef = useRef(props.runtime);

  if (!props.runtime) {
    throw new Error(
      "Must instantiate runtime and provide through the Keyboard props API"
    );
  }

  return (
    <Container runtimeRef={runtimeRef}>
      <KeyboardCanvas runtimeRef={runtimeRef}>
        <KeyboardScene runtimeRef={runtimeRef}>
          <React.Suspense fallback={null}>
            <Model />
          </React.Suspense>
          {/*<KeyboardObject runtimeRef={runtimeRef} />*/}
        </KeyboardScene>
      </KeyboardCanvas>
    </Container>
  );
});

Keyboard.displayName = "Keyboard";
