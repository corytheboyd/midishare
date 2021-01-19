import { render } from "react-dom";
import * as React from "react";
import { Chrome } from "./chrome";
import { GetStarted } from "./views/GetStarted";
import { useStore } from "./lib/store";
import { Inspector } from "./views/Inspector";

const App: React.FC = () => {
  const ready = useStore((state) => state.ready);

  return <Chrome>{ready ? <Inspector /> : <GetStarted />}</Chrome>;
};

render(<App />, document.getElementById("root"));
