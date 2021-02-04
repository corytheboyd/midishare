import React, { useMemo } from "react";
import { Chrome } from "../Chrome";
import { createRuntime, Keyboard } from "@midishare/keyboard";
import { PROTECTED_CDN_URL } from "../../lib/constants";

export const Home: React.FC = () => {
  const runtime = useMemo(
    () =>
      createRuntime({
        assetPath: PROTECTED_CDN_URL,
      }),
    []
  );

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

          <div className="mt-8">
            <Keyboard runtime={runtime} />
          </div>
        </div>
      </article>
    </Chrome>
  );
};
