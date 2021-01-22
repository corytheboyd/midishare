import debug from "debug";
import React from "react";

const baseLogger = debug("@midishare/keyboard");

export const storeLogger = baseLogger.extend("store");
export const runtimeLogger = baseLogger.extend("runtime");
export const rafLogger = baseLogger.extend("raf");

const _onlyRenderOnceLogger = baseLogger.extend("badRender");
export const onlyRenderOnceLogger = (component: React.FC): void =>
  _onlyRenderOnceLogger(
    `${component.name} rendered. This should only happen once`
  );
