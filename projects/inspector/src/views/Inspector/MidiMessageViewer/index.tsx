import * as React from "react";
import { MessageStream } from "../../common/MessageStream";
import { FilterState, store, useStore } from "../../../lib/store";
import { createRef, useCallback, useEffect } from "react";
import { MessageStreamStore } from "../../common/MessageStream/lib/createStore";
import { InputEventBase, InputEvents } from "webmidi";
import { midiMessageViewerLogger } from "../../../lib/debug";
import { MidiMessage } from "../../../lib/createMidiMessageFromEvent";
import { eventNameFromMidiMessage } from "./eventNameFromMidiMessage";

function applyFilters(
  messages: MidiMessage[],
  filters: FilterState
): MidiMessage[] {
  return messages.filter((message) => !!filters.eventType[message[0]]);
}

const MidiDataView: React.FC<{ data: Uint8Array }> = ({ data }) => {
  const numericalFormat = useStore((state) => state.numericalFormat);

  const renderParts = [];
  for (const decimalPart of Array.from(data.values())) {
    if (numericalFormat === "binary") {
      renderParts.push(decimalPart.toString(2));
    } else if (numericalFormat === "decimal") {
      renderParts.push(decimalPart.toString(10));
    }
  }

  return (
    <span className="text-gray-400 text-xs space-x-1">
      <span>{"{"}</span>
      <span>status:</span>
      <span className="text-gray-300 text-sm">{renderParts[0]}</span>
      <span>data:</span>
      <span className="text-gray-300 text-sm">
        {renderParts.slice(1).join(", ")}
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
    MessageStreamStore<MidiMessage | string>
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
      (events: MidiMessage[]) => {
        const filteredEvents = applyFilters(events, filters);

        if (filteredEvents.length === 0) {
          return messageStreamStoreRef.current
            .getState()
            .replaceMessages([
              `${events.length} message(s) captured, but none are visible. Try adjusting the Event filters!`,
            ]);
        }

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

        const messageNumber =
          messageStreamStoreRef.current.getState().messages.length - index;

        return (
          <span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-xs">[{messageNumber}]</span>
              <span>{event[1].toFixed(3)}</span>
              <span>{eventNameFromMidiMessage(event[0])}</span>
              <MidiDataView data={event[2]} />
            </div>
          </span>
        );
      }}
    />
  );
};
