import * as React from "react";
import { Page } from "./common/Page";
import { getMidiAccess } from "../lib/getMidiAccess";
import { createDeviceListeners } from "../lib/createDeviceListeners";
import { addAllInputsToState } from "../lib/addAllInputsToState";
import { Metronome } from "./common/Metronome";

export const GetStarted: React.FC = () => {
  return (
    <Page>
      <main className="h-full flex flex-col items-center justify-center">
        <Metronome />
        <br />
        <button
          className="bg-blue-500 py-1.5 px-3 text-lg text-white rounded-md"
          onClick={async () => {
            await getMidiAccess();
            await addAllInputsToState();
            createDeviceListeners();
          }}
        >
          Get Started
        </button>
      </main>
    </Page>
  );
};
