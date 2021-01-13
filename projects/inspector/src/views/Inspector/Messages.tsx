import * as React from "react";
import { useStore } from "../../store";
import { relativeTimestampToAbsolute } from "../../lib/relativeTimestampToAbsolute";
import { useCallback } from "react";

export const Messages: React.FC = () => {
  const activeInputId = useStore((state) => state.activeInputId);
  const events = useStore(
    useCallback((state) => state.events[activeInputId], [activeInputId])
  );

  return (
    <section id="logs" className="h-full flex-grow">
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
            <div className="h-full flex flex-col-reverse">
              {events.slice(-100).map((event) => (
                <div
                  key={`${event.type}:${event.timestamp}:${event.data}`}
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
