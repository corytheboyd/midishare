import React from "react";
import { Chrome } from "../Chrome";

export const HomePage: React.FC = () => {
  return (
    <Chrome>
      <article className="flex flex-col items-center">
        <div className="text-center pb-5 max-w-3xl">
          <h1 className="font-serif font-bold text-5xl mt-8">
            Remote keyboard sharing for teachers and students
          </h1>
          <p>THis is sparta</p>
        </div>
      </article>
    </Chrome>
  );
};
