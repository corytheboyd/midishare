import * as React from "react";

export const Chrome: React.FC = (props) => {
  return (
    <div className="flex flex-col h-full">
      <nav className="bg-red-300">
        <h1>MIDI Inspector</h1>
      </nav>
      <main className="flex-grow bg-blue-300">
        <section className="">{props.children}</section>
      </main>
      <footer className="bg-yellow-300">
        <span>Footer content</span>
      </footer>
    </div>
  );
};
