import * as React from "react";
import { useRef } from "react";
import { createRuntime, Keyboard } from "../../../src";
import { InlineCode } from "../lib/InlineCode";
import { Example } from "../lib/Example";

const BasicExample: React.FC = () => {
  const runtime = useRef(createRuntime({ id: "BasicExample" }));

  return <Keyboard runtime={runtime.current} />;
};

// ----------------------------------------------

const code = `
import * as React from "react";
import { useRef } from "react";
import { createRuntime, Keyboard } from "@midishare/keyboard";

export const HelloKeyboard: React.FC = () => {
  const runtime = useRef(createRuntime());

  return <Keyboard runtime={runtime.current} />;
};
`.trim();

// ----------------------------------------------

export const Basic: React.FC = () => (
  <Example
    title="Hello, Keyboard!"
    example={<BasicExample />}
    code={code}
    description={
      <>
        <p>
          Creating a <InlineCode>Keyboard</InlineCode> requires one dependency,
          a <InlineCode>Runtime</InlineCode> instance.
        </p>
        <p>
          The <InlineCode>Runtime</InlineCode> instance is how you interact with
          the keyboard, as seen in later examples.
        </p>
      </>
    }
  />
);