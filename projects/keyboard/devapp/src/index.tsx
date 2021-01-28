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
  const [show, setShow] = useState(true);

  const runtime1 = useMemo(
    () => createRuntime({ id: "test-1", keyPressedColor: "purple" }),
    []
  );
  const runtime2 = useMemo(
    () => createRuntime({ id: "test-2", keyPressedColor: "green" }),
    []
  );

  const handleMouseDown = () => {
    runtime1.keyOn("C4", 100);
    runtime1.keyOn("E4", 100);
    runtime1.keyOn("G4", 100);
    runtime1.keyOn("AsBb4", 100);

    runtime2.keyOn("C4", 100);
    runtime2.keyOn("E4", 100);
    runtime2.keyOn("G4", 100);
    runtime2.keyOn("AsBb4", 100);
  };

  const handleMouseUp = () => {
    runtime1.keyOff("C4");
    runtime1.keyOff("E4");
    runtime1.keyOff("G4");
    runtime1.keyOff("AsBb4");

    runtime2.keyOff("C4");
    runtime2.keyOff("E4");
    runtime2.keyOff("G4");
    runtime2.keyOff("AsBb4");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full">
        <Keyboard runtime={runtime1} />
      </div>
      {show && (
        <div className="w-full">
          <Keyboard runtime={runtime2} />
        </div>
      )}
      <button onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        Play Me Daddy
      </button>
      <button
        onClick={() => {
          setShow(!show);
        }}
      >
        {show ? "Hide" : "Show"} me daddy
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
