import * as React from "react";
import { useStore } from "../../store";
import { Message } from "./Message";

export const Messages: React.FC = () => {
  const activeInputId = useStore((state) => state.activeInputId);
  const messages = useStore((state) => state.messages[activeInputId]);

  return (
    <section id="logs" className="h-full flex-grow">
      {messages == null && (
        <div className="flex items-center justify-center h-full w-full">
          <span className="text-sm text-gray-500">
            Select a device on the left to inspect MIDI messages
          </span>
        </div>
      )}

      {messages != null && (
        <>
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full w-full">
              <span className="text-sm text-gray-500">
                No messages received from this device yet
              </span>
            </div>
          )}

          {messages.length > 0 && <span>has messages</span>}
        </>
      )}
    </section>
  );
};
