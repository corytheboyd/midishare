import * as React from "react";
import { Container } from "./Container";
import { KeyboardCanvas } from "./KeyboardCanvas";
import { KeyboardScene } from "./KeyboardScene";
import { KeyboardObject } from "./KeyboardObject";
import { Runtime } from "./lib/Runtime";
import { memo, useRef } from "react";
import { onlyRenderOnceLogger } from "./lib/debug";

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
    <Container>
      <KeyboardCanvas>
        <KeyboardScene>
          <KeyboardObject runtimeRef={runtimeRef} />
        </KeyboardScene>
      </KeyboardCanvas>
    </Container>
  );
});

Keyboard.displayName = "Keyboard";
