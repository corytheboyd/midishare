import * as React from "react";
import { render } from "react-dom";
import { Basic } from "./examples/Basic";

// TODO offer some sort of UI to control this? See:
//  https://github.com/visionmedia/debug#browser-support
localStorage.setItem("debug", `@midishare/keyboard:*,-@midishare/keyboard:raf`);

const App: React.FC = () => {
  return (
    <div className="h-full w-full bg-gray-200 flex flex-col items-center">
      <div className="h-full w-full max-w-5xl ">
        <Basic />
      </div>
    </div>
  );
};

render(<App />, document.getElementById("root"));
