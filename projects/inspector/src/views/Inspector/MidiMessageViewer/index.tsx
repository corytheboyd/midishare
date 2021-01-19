import * as React from "react";
import { MessageStream } from "../../common/MessageStream";
import { useStore } from "../../../lib/store";
import { createRef, useCallback, useEffect } from "react";
import { MessageStreamStore } from "../../common/MessageStream/lib/createStore";
import { InputEventBase, InputEvents } from "webmidi";
import { baseLogger } from "../../../lib/debug";

export const MidiMessageViewer: React.FC = () => {
  const activeInputId = useStore((state) => state.activeInputId);
  const eventsForActiveInput = useStore(
    useCallback((state) => state.events[activeInputId], [activeInputId])
  );

  const messageStreamStoreRef = createRef<
    MessageStreamStore<InputEventBase<keyof InputEvents> | string>
  >();

  useEffect(() => {
    if (!messageStreamStoreRef.current) {
      baseLogger("MessageStream store ref not initialized!");
      return;
    }

    if (!activeInputId) {
      messageStreamStoreRef.current
        .getState()
        .replaceMessages(["Select an input device to inspect MIDI messages"]);
      return;
    }

    if (eventsForActiveInput.length === 0) {
      messageStreamStoreRef.current
        .getState()
        .replaceMessages([
          "Waiting to receive MIDI messages for selected device",
        ]);
      return;
    }

    baseLogger(
      "Replace MessageStream content with events for new input device"
    );
    messageStreamStoreRef.current
      .getState()
      .replaceMessages(eventsForActiveInput);
  }, [activeInputId]);

  return <MessageStream storeRef={messageStreamStoreRef} />;
};
