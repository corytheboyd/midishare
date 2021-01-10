import { render } from "react-dom";
import * as React from "react";
import { Chrome } from "./chrome";
import { GetStarted } from "./views/GetStarted";

const App: React.FC = () => {
  return (
    <Chrome>
      <GetStarted />
    </Chrome>
  );
};

render(<App />, document.getElementById("root"));
