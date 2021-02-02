import React from "react";
import { Chrome } from "./Chrome";
import { Home } from "./Home";

export const App: React.FC = () => {
  return (
    <Chrome>
      <Home />
    </Chrome>
  );
};
