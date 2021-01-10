import { render } from "react-dom";
import * as React from "react";

console.log("hey");

const App: React.FC = () => {
  return (
    <div>
      <h1>MIDI Inspector</h1>
    </div>
  );
};

render(<App />, document.getElementById("root"));
