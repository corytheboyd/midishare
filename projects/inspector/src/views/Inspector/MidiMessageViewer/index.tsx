import * as React from "react";
import { MessageStream } from "../../common/MessageStream";
import { store, useStore } from "../../../lib/store";
import { createRef, useEffect } from "react";
import { MessageStreamStore } from "../../common/MessageStream/lib/createStore";
import { InputEventBase, InputEvents } from "webmidi";
import { midiMessageViewerLogger } from "../../../lib/debug";

export const MidiMessageViewer: React.FC = () => {
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
      (newEvents: InputEventBase<keyof InputEvents>[]) => {
        // When it's the first event, replace so that we discard the zero state
        // message.
        if (newEvents.length === 1) {
          messageStreamStoreRef.current.getState().replaceMessages(newEvents);
        } else {
          // Otherwise, add the new event with the addMessage function.
          messageStreamStoreRef.current
            .getState()
            .addMessage(newEvents[newEvents.length - 1]);
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
