import * as React from "react";
import { useEffect, useRef } from "react";
import { createRuntime, Keyboard } from "../../../src";
import { Example } from "../Example";
import { InlineCode } from "../lib/InlineCode";
import { KeyName } from "../../../src/types";

const MovingKeysExample: React.FC = () => {
  const runtime = useRef(createRuntime());

  useEffect(() => {
    const keyNamesWithVelocity: [KeyName, number][] = [
      ["C4", 100],
      ["E4", 100],
      ["G4", 100],
    ];

    for (const [key, velocity] of keyNamesWithVelocity) {
      runtime.current.keyOn(key, velocity);
    }
  });

  return <Keyboard runtime={runtime.current} />;
};

// ----------------------------------------------

const code = `
import * as React from "react";
import { useEffect, useRef } from "react";
import { createRuntime, Keyboard, KeyName } from "@midishare/keyboard";

const MovingKeysExample: React.FC = () => {
  const runtime = useRef(createRuntime());

  useEffect(() => {
    const keyNamesWithVelocity: [KeyName, number][] = [
      ["C4", 100],
      ["E4", 100],
      ["G4", 100],
    ];

    for (const [key, velocity] of keyNamesWithVelocity) {
      runtime.current.keyOn(key, velocity);
    }
  });

  return <Keyboard runtime={runtime.current} />;
};
`.trim();

// ----------------------------------------------

export const MovingKeys: React.FC = () => (
  <Example
    title="Moving Keys"
    example={<MovingKeysExample />}
    code={code}
    description={
      <>
        <p>
          Use the <InlineCode>Runtime</InlineCode> API is used to move the keys.
        </p>
      </>
    }
  />
);
