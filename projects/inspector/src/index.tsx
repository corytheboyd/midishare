import { render } from "react-dom";
import * as React from "react";
import WebMidi from "webmidi";
import { useStore } from "./store";
import { createInputWatchers } from "./lib/createInputWatchers";
import { Chrome } from "./chrome";

const App: React.FC = () => {
  const addInput = useStore((state) => state.addInput);
  const removeInput = useStore((state) => state.removeInput);

  return (
    <Chrome>
      <h1 className="text-lg">MIDI Inspector</h1>
      <button
        className="bg-blue-500 py-1.5 px-3 text-lg text-white rounded-md"
        onClick={() => {
          WebMidi.enable((error) => {
            if (error) {
              console.error("MIDI not acquired", error);
              return;
            }

            // Sync MIDI devices to state
            WebMidi.inputs.forEach((input) => {
              addInput(input);
              createInputWatchers(input);
            });

            WebMidi.addListener("connected", (event) => {
              if (event.port.type === "input") {
                addInput(event.port);
              }
            });

            WebMidi.addListener("disconnected", (event) => {
              if (event.port.type === "input") {
                removeInput(event.port.id);
              }
            });
          }, true);
        }}
      >
        Get Started
      </button>
    </Chrome>
  );
};

render(<App />, document.getElementById("root"));
