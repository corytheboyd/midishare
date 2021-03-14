import React from "react";
import { Navbar } from "./Navbar";

/**
 * @note Parent must have `flex`, `flex-col` classes
 * */
export const MaxWidthContent: React.FC = (props) => (
  <div className="w-full max-w-4xl self-center">{props.children}</div>
);

type ChromeProps = {
  hideFooter?: boolean;
};

export const Chrome: React.FC<ChromeProps> = (props) => {
  return (
    <div className="flex flex-col h-full">
      <nav className="flex flex-col p-4 bg-gray-700">
        <Navbar />
      </nav>

      <main id="main" className="flex-grow">
        {props.children}
      </main>

      {!props.hideFooter && (
        <footer className="bg-gray-800 flex flex-col p-5 text-gray-400">
          <MaxWidthContent>
            <div className="flex items-center justify-center">
              <span className="text-xs">© Midishare • 2021</span>
            </div>
          </MaxWidthContent>
        </footer>
      )}
    </div>
  );
};
