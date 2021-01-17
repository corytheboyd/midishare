import * as React from "react";
import { useRef } from "react";

export const Metronome: React.FC = () => {
  const tickerRef = useRef(0);
  const shouldRenderBeat = useRef(false);

  return <h1>Metronome</h1>;
};
