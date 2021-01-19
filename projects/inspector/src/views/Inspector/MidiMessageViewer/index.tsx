import * as React from "react";
import { MessageStream } from "../../common/MessageStream";
import { store, useStore } from "../../../lib/store";
import { createRef, useEffect, useRef } from "react";
import { MessageStreamStore } from "../../common/MessageStream/lib/createStore";
import { InputEventBase, InputEvents } from "webmidi";
import { midiMessageViewerLogger } from "../../../lib/debug";
import { start } from "repl";

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
        if (events.length === 1) {
          midiMessageViewerLogger(
            "Replacing events messages on first real event"
          );
          messageStreamStoreRef.current.getState().replaceMessages(events);
          lastPushedIndex.current += 1;
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

  return (
    <MessageStream
      storeRef={messageStreamStoreRef}
      renderRow={(event: InputEventBase<keyof InputEvents> | string) => {
        if (typeof event === "string") {
          return <span>{event}</span>;
        }
        return (
          <span>
            {event.type} - {event.data}
          </span>
        );
      }}
    />
  );
};
