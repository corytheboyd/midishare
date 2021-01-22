import * as React from "react";
import { render } from "react-dom";
import { useMemo } from "react";

// TODO also test with it install as NPM module
import { createRuntime, Keyboard } from "../../src";
import { getKeyNameFromIndex } from "../../src/lib/convert/getKeyNameFromIndex";

// TODO offer some sort of UI to control this? See:
//  https://github.com/visionmedia/debug#browser-support
localStorage.setItem("debug", `@midishare/keyboard:*,-@midishare/keyboard:raf`);

const App: React.FC = () => {
  const runtime = useMemo(() => {
    const rt = createRuntime({
      keyPressedColor: "blue",
    });

    rt.onReady(() => {
      // const holdTimeMs = 100;
      // const getDelayTimeMs = (i) => i * 40;
      // for (let i = 0; i < 88; i++) {
      //   const keyName = getKeyNameFromIndex(i);
      //   setTimeout(() => {
      //     rt.keyOn(keyName, 100);
      //     setTimeout(() => rt.keyOff(keyName), holdTimeMs);
      //   }, getDelayTimeMs(i));
      // }

      rt.keyOn("C4", 10);
      rt.keyOn("D4", 20);
      rt.keyOn("E4", 30);
    });

    return rt;
  }, []);

  return (
    <div>
      <Keyboard runtime={runtime} />
    </div>
  );
};

render(<App />, document.getElementById("root"));
