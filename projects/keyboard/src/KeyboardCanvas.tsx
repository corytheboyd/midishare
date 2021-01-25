import * as React from "react";
import { Canvas } from "react-three-fiber";
import { onlyRenderOnceLogger } from "./lib/debug";
import { KeyboardRuntimeProps } from "./types";

export const KeyboardCanvas: React.FC<KeyboardRuntimeProps> = (props) => {
  onlyRenderOnceLogger(KeyboardCanvas);

  return null;
};
