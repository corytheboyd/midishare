import * as React from "react";
import Prism from "react-syntax-highlighter/dist/cjs/prism-light";
import ts from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import style from "react-syntax-highlighter/dist/cjs/styles/prism/darcula";

Prism.registerLanguage("typescript", ts);

type ExampleProps = {
  title: string;
  description?: JSX.Element;
  example: JSX.Element;
  code: string;
};

export const Example: React.FC<ExampleProps> = (props) => {
  return (
    <article className="w-full">
      <section className="mb-5 space-y-3">
        <h2 className="font-bold font-sans text-xl">{props.title}</h2>
        <div>{props.description || null}</div>
      </section>

      <div className="bg-gray-300 rounded-xl">
        <section className="px-5 py-3">{props.example}</section>
        <section className="bg-gray-800 rounded-b-xl font-mono text-xs">
          <Prism language="typescript" style={style} className="rounded-b-xl">
            {props.code}
          </Prism>
        </section>
      </div>
    </article>
  );
};
