import React, { useRef } from "react";
import { Chrome } from "./Chrome";

// TODO move keyboard to actual npm package
// import { Keyboard, Runtime } from "@midishare/keyboard";

export const App: React.FC = () => {
  // const runtimeRef = useRef<Runtime>();

  return (
    <Chrome>
      <article className="flex flex-col items-center">
        <div className="text-center pb-5 max-w-3xl">
          <h1 className="font-serif font-bold text-5xl mt-8">
            Live music sessions with real-time MIDI input streaming
          </h1>
          <p className="mt-8 text-xl">
            Lorem ipsum lorem ipsum ya hurd. Bird up!
          </p>
        </div>

        <code>process.env.CDN_URL = {process.env.CDN_URL}</code>
        {/*<Keyboard*/}
        {/*  runtime={runtimeRef}*/}
        {/*  options={{*/}
        {/*    assetPath: process.env.CDN_URL,*/}
        {/*  }}*/}
        {/*/>*/}
      </article>
    </Chrome>
  );
};
