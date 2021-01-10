import * as React from "react";
import { Page } from "./common/Page";
import { getMidiAccess } from "../lib/getMidiAccess";
import { registerMidiDeviceListeners } from "../lib/registerMidiDeviceListeners";

export const GetStarted: React.FC = () => {
  return (
    <Page>
      <main className="h-full flex items-center justify-center">
        <button
          className="bg-blue-500 py-1.5 px-3 text-lg text-white rounded-md"
          onClick={async () => {
            await getMidiAccess();
            registerMidiDeviceListeners();
          }}
        >
          Get Started
        </button>
      </main>
    </Page>
  );
};
