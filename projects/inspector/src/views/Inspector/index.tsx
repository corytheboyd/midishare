import { Page } from "../common/Page";
import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Messages } from "./Messages";

export const Inspector: React.FC = () => {
  return (
    <Page>
      <div className="flex flex-row h-full">
        <Sidebar />
        <Messages />
      </div>
    </Page>
  );
};
