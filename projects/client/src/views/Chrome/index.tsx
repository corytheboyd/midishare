import React from "react";
import { Navbar } from "./Navbar";

/**
 * @note Parent must have `flex`, `flex-col` classes
 * */
export const MaxWidthContent: React.FC = (props) => (
  <div className="w-full max-w-4xl self-center">{props.children}</div>
);

export const Chrome: React.FC = (props) => {
  return (
    <div className="flex flex-col h-full">
      <nav className="flex flex-col p-4 border-b-2">
        <Navbar />
      </nav>

      <main id="main" className="flex-grow">
        {props.children}
      </main>

      <footer className="bg-gray-100 flex flex-col p-5">
        <MaxWidthContent>
          <div className="flex items-center justify-center">
            <span className="text-sm">© Midishare • 2021</span>
          </div>
        </MaxWidthContent>
      </footer>
    </div>
  );
};
