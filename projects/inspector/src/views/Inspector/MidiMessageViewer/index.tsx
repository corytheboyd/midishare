import * as React from "react";
import { MessageStream } from "../../common/MessageStream";
import { FilterState, store, useStore } from "../../../lib/store";
import { createRef, useCallback, useEffect, useRef } from "react";
import { MessageStreamStore } from "../../common/MessageStream/lib/createStore";
import { InputEventBase, InputEvents } from "webmidi";
import { midiMessageViewerLogger } from "../../../lib/debug";

function applyFilters(
  events: InputEventBase<keyof InputEvents>[],
  filters: FilterState
): InputEventBase<keyof InputEvents>[] {
  return events.filter((event) => !!filters.eventType[event.type]);
}

const MidiDataView: React.FC<{ data: Uint8Array }> = ({ data }) => {
  const binaryParts = [];
  for (const decimalPart of Array.from(data.values())) {
    binaryParts.push(decimalPart.toString(2));
  }
  return (
    <span className="text-gray-400 text-xs space-x-1">
      <span>{"{"}</span>
      <span>status:</span>
      <span className="text-gray-300 text-sm">{binaryParts[0]}</span>
      <span>data:</span>
      <span className="text-gray-300 text-sm">
        {binaryParts.slice(1).join(", ")}
      </span>
      <span>{"}"}</span>
    </span>
  );
};

export const MidiMessageViewer: React.FC = () => {
  const activeInputId = useStore((state) => state.activeInputId);
  const filters = useStore(
    useCallback((state) => state.filter[activeInputId], [activeInputId])
  );

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

    const initialEvents = applyFilters(
      store.getState().events[activeInputId],
      store.getState().filter[activeInputId]
    );

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
        const filteredEvents = applyFilters(events, filters);
        messageStreamStoreRef.current
          .getState()
          .replaceMessages(filteredEvents);
      },
      (state) => state.events[activeInputId]
    );
  }, [activeInputId, filters]);

  return (
    <MessageStream
      storeRef={messageStreamStoreRef}
      renderRow={(event: InputEventBase<keyof InputEvents> | string, index) => {
        if (typeof event === "string") {
          return <span>{event}</span>;
        }

        return (
          <span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-xs">[{index}]</span>
              <span>{event.timestamp.toFixed(3)}</span>
              <span>{event.type}</span>
              <MidiDataView data={event.data} />
            </div>
          </span>
        );
      }}
    />
  );
};
