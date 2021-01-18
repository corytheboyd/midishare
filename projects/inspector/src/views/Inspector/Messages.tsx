import * as React from "react";
import { useStore } from "../../store";
import { relativeTimestampToAbsolute } from "../../lib/relativeTimestampToAbsolute";
import { useCallback } from "react";

const MESSAGE_BUFFER_SIZE = 1000;

export const Messages: React.FC = () => {
  const activeInputId = useStore((state) => state.activeInputId);
  const events = useStore(
    useCallback((state) => state.events[activeInputId], [activeInputId])
  );

  return (
    <section id="logs" className="flex-grow overflow-y-auto">
      {events == null && (
        <div className="flex items-center justify-center h-full w-full">
          <span className="text-sm text-gray-500">
            Select a device on the left to inspect MIDI events
          </span>
        </div>
      )}

      {events != null && (
        <>
          {events.length === 0 && (
            <div className="flex items-center justify-center h-full w-full">
              <span className="text-sm text-gray-500">
                No events received from this device yet
              </span>
            </div>
          )}

          {events.length > 0 && (
            <div className="flex flex-col-reverse">
              {events.slice(-1 * MESSAGE_BUFFER_SIZE).map((event, index) => (
                <div
                  key={index}
                  className="font-mono font-light text-xs space-x-2"
                >
                  <span>{relativeTimestampToAbsolute(event.timestamp)}</span>
                  <span>{event.type}</span>
                  <span>{event.data}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};
