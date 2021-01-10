import * as React from "react";

export const Chrome: React.FC = (props) => {
  return (
    <div className="flex flex-col h-full">
      <nav className="bg-gray-800 text-gray-200 px-3 py-2">
        <h1 className="font-mono font-medium font-thin">MIDI Inspector</h1>
      </nav>
      <main className="bg-gray-200 text-gray-800 flex-grow">
        {props.children}
      </main>
      <footer className="bg-gray-300 text-gray-500 px-5 py-5 text-center">
        <span className="text-sm">© Midishare • 2021</span>
      </footer>
    </div>
  );
};
