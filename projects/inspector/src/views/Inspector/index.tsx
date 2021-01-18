import { Page } from "../common/Page";
import * as React from "react";
import { Sidebar } from "./Sidebar";
import { MessageStream } from "./MessageStream";
import { createRef, useEffect } from "react";
import { MessageStreamStore } from "./MessageStream/lib/createStore";

export const Inspector: React.FC = () => {
  const storeRef = createRef<MessageStreamStore<string>>();

  useEffect(() => {
    if (storeRef.current) {
      storeRef.current.getState().addMessage("this is a test");
    }
  }, []);

  return (
    <Page>
      <div className="flex flex-row h-full">
        <Sidebar />
        <div className="w-full h-full flex flex-col">
          <div className="flex-grow">
            <span>shit on the floor</span>
          </div>
          <div className="flex-grow-0">
            <MessageStream storeRef={storeRef} />
          </div>
        </div>
      </div>
    </Page>
  );
};
