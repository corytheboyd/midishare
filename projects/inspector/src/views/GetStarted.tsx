import * as React from "react";
import { Page } from "./common/Page";
import { getMidiAccess } from "../lib/getMidiAccess";
import { createDeviceListeners } from "../lib/createDeviceListeners";
import { addAllInputsToState } from "../lib/addAllInputsToState";
import { useStore } from "../lib/store";

export const GetStarted: React.FC = () => {
  const makeReady = useStore((state) => state.makeReady);

  return (
    <Page>
      <main className="h-full flex flex-col items-center justify-center">
        <button
          className="bg-blue-500 py-1.5 px-3 text-lg text-white rounded-md"
          onClick={async () => {
            await getMidiAccess();
            makeReady();
            addAllInputsToState();
            createDeviceListeners();
          }}
        >
          Get Started
        </button>
      </main>
    </Page>
  );
};
