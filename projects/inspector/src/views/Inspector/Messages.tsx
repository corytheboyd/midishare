import * as React from "react";
import { useStore } from "../../store";

export const Messages: React.FC = () => {
  const activeInputId = useStore((state) => state.activeInputId);
  const input = useStore((state) => state.inputs[activeInputId]);

  return <section id="logs" className="h-full"></section>;
};
