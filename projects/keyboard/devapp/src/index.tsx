import * as React from "react";
import { render } from "react-dom";
import { codeExample, BasicExample } from "./examples/BasicExample";

import Prism from "react-syntax-highlighter/dist/cjs/prism-light";
import ts from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import docco from "react-syntax-highlighter/dist/cjs/styles/prism/darcula";

Prism.registerLanguage("typescript", ts);

// TODO offer some sort of UI to control this? See:
//  https://github.com/visionmedia/debug#browser-support
localStorage.setItem("debug", `@midishare/keyboard:*,-@midishare/keyboard:raf`);

const App: React.FC = () => {
  return (
    <div className="h-full bg-gray-200">
      <div className="h-full max-w-5xl flex flex-col items-center">
        <article className="w-full">
          <section>
            <h2 className="font-bold font-sans text-lg">Example</h2>
            <p>Description of the example</p>
          </section>

          <div className="bg-gray-300 rounded-xl">
            <section className="px-5 py-3">
              <BasicExample />
            </section>

            <section className="bg-gray-800 rounded-b-xl font-mono text-xs">
              <Prism
                language="typescript"
                style={docco}
                className="rounded-b-xl"
              >
                {codeExample}
              </Prism>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
};

render(<App />, document.getElementById("root"));
