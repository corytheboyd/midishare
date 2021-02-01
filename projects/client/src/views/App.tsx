import React from "react";
import { Chrome, MaxWidthContent } from "./Chrome";

export const App: React.FC = () => {
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

        <MaxWidthContent></MaxWidthContent>
      </article>
    </Chrome>
  );
};
