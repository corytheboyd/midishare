import * as React from "react";
import { render } from "react-dom";
import { Basic } from "./examples/Basic";
import { MovingKeys } from "./examples/MovingKeys";

// TODO offer some sort of UI to control this? See:
//  https://github.com/visionmedia/debug#browser-support
localStorage.setItem("debug", `@midishare/keyboard:*,-@midishare/keyboard:raf`);

const App: React.FC = () => {
  return (
    <main className="h-full w-full flex flex-col items-center">
      <section className="h-full w-full max-w-5xl space-y-7">
        <Basic />
        <MovingKeys />
      </section>
    </main>
  );
};

render(<App />, document.getElementById("root"));
