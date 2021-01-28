import * as React from "react";
import { render } from "react-dom";
import { Basic } from "./examples/Basic";
import { MovingKeys } from "./examples/MovingKeys";
import { createRuntime, Keyboard } from "../../src";
import { useMemo, useState } from "react";

// TODO offer some sort of UI to control this? See:
//  https://github.com/visionmedia/debug#browser-support
// localStorage.setItem("debug", `@midishare/keyboard:*,-@midishare/keyboard:raf`);
localStorage.setItem("debug", `@midishare/keyboard:raf`);

const App: React.FC = () => {
  const [ready, setReady] = useState(false);

  const runtime = useMemo(() => {
    const runtime = createRuntime({ id: "test", keyPressedColor: "purple" });

    runtime.onReady(() => {
      setReady(true);
    });

    return runtime;
  }, []);

  const handleMouseDown = () => {
    runtime.keyOn("C4", 100);
    runtime.keyOn("E4", 100);
    runtime.keyOn("G4", 100);
  };

  const handleMouseUp = () => {
    runtime.keyOff("C4");
    runtime.keyOff("E4");
    runtime.keyOff("G4");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="p-5 w-full bg-purple-300 shadow-inner rounded-xl">
        <Keyboard runtime={runtime} />
      </div>
      <button
        disabled={!ready || runtime.needRender}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        Play Me Daddy
      </button>
    </div>
  );

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
