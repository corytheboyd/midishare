import { Page } from "../common/Page";
import * as React from "react";
import { Sidebar } from "./Sidebar";
import { MidiMessageViewer } from "./MidiMessageViewer";
import { TimingClockViewer } from "../common/TimingClockViewer";

export const Inspector: React.FC = () => {
  return (
    <Page>
      <div className="bg-gray-700 flex flex-row h-full">
        <Sidebar />

        <section className="w-full h-full flex flex-col">
          <section className="flex-grow flex p-1 space-x-1">
            <div>
              <TimingClockViewer />
            </div>
          </section>

          <section className="flex-grow-0">
            <MidiMessageViewer />
          </section>
        </section>
      </div>
    </Page>
  );
};
