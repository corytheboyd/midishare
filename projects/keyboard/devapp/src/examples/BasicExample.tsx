import { createRuntime, Keyboard } from "../../../src";
import * as React from "react";
import { useMemo } from "react";

export const BasicExample: React.FC = () => {
  const runtime = useMemo(() => createRuntime(), []);

  return <Keyboard runtime={runtime} />;
};

export const codeExample = `
import React from 'react';

export const BasicExample: React.FC = () => {
  const runtime = useMemo(() => createRuntime(), []);
  
  return <Keyboard runtime={runtime} />;
}
`.trim();
