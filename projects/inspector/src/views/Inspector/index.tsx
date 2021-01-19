import { Page } from "../common/Page";
import * as React from "react";
import { Sidebar } from "./Sidebar";
import { MidiMessageViewer } from "./MidiMessageViewer";

export const Inspector: React.FC = () => {
  return (
    <Page>
      <div className="flex flex-row h-full">
        <Sidebar />
        <div className="w-full h-full flex flex-col">
          <div className="flex-grow">
            <span>shit on the floor</span>
          </div>
          <div className="flex-grow-0">
            <MidiMessageViewer />
          </div>
        </div>
      </div>
    </Page>
  );
};
