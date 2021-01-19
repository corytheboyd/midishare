import * as React from "react";
import { MessageStream } from "../../common/MessageStream";
import { store, useStore } from "../../../lib/store";
import { createRef, useEffect, useRef } from "react";
import { MessageStreamStore } from "../../common/MessageStream/lib/createStore";
import { InputEventBase, InputEvents } from "webmidi";
import { midiMessageViewerLogger } from "../../../lib/debug";
import format from "date-fns/format";

export const MidiMessageViewer: React.FC = () => {
  const lastPushedIndex = useRef(0);

  const activeInputId = useStore((state) => state.activeInputId);

  const messageStreamStoreRef = createRef<
    MessageStreamStore<InputEventBase<keyof InputEvents> | string>
  >();

  // When the active input device changes, copy the recorded events for that
  // device to the MessageStream store.
  useEffect(() => {
    if (!messageStreamStoreRef.current) {
      midiMessageViewerLogger("MessageStream store ref not initialized!");
      return;
    }

    if (!activeInputId) {
      messageStreamStoreRef.current
        .getState()
        .replaceMessages(["Select an input device to inspect MIDI messages"]);
      return;
    }

    const initialEvents = store.getState().events[activeInputId];
    if (initialEvents.length === 0) {
      midiMessageViewerLogger(
        "Replace MessageStream content with zero state message"
      );
      messageStreamStoreRef.current
        .getState()
        .replaceMessages([
          "Waiting to receive MIDI messages for selected device",
        ]);
    } else {
      midiMessageViewerLogger(
        "Replace MessageStream content with events for new input device"
      );
      messageStreamStoreRef.current.getState().replaceMessages(initialEvents);
    }

    midiMessageViewerLogger(
      "Register events listener to update MessageStream state"
    );
    return store.subscribe(
      (events: InputEventBase<keyof InputEvents>[]) => {
        // When it's the first event, replace so that we discard the zero state
        // message.
        if (lastPushedIndex.current === 0) {
          midiMessageViewerLogger(
            "Replacing events messages on first real event"
          );
          messageStreamStoreRef.current.getState().replaceMessages(events);
          lastPushedIndex.current += events.length;
        } else {
          const newEvents = events.slice(
            lastPushedIndex.current || lastPushedIndex.current + 1
          );

          for (const event of newEvents) {
            messageStreamStoreRef.current.getState().addMessage(event);
          }

          // Update cursor to end of current events list with the information
          // we have.
          lastPushedIndex.current += newEvents.length;
        }
      },
      (state) => state.events[activeInputId]
    );
  }, [activeInputId]);

  const startTime = useRef<number>();

  return (
    <MessageStream
      storeRef={messageStreamStoreRef}
      renderRow={(event: InputEventBase<keyof InputEvents> | string) => {
        if (typeof event === "string") {
          return <span>{event}</span>;
        }
        if (!startTime.current) {
          startTime.current = new Date().getTime() - event.timestamp;
        }
        return (
          <span>
            {format(
              new Date(startTime.current + event.timestamp),
              "HH:mm:ss.SSS"
            )}{" "}
            {event.type} - {event.data}
          </span>
        );
      }}
    />
  );
};
