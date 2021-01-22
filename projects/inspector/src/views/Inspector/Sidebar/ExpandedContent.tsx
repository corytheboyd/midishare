import * as React from "react";
import { InputSelect } from "./InputSelect";
import { MidiDataNumericalFormat, useStore } from "../../../lib/store";
import { MidiMessageType } from "../../../lib/createMidiMessageFromEvent";

const EventTypeCount: React.FC<{
  eventType: MidiMessageType;
}> = ({ eventType }) => {
  const activeInputId = useStore((state) => state.activeInputId);
  const count = useStore(
    (state) => state.eventsCount[activeInputId][eventType]
  );

  return (
    <span className="bg-gray-700 text-gray-200 text-xs px-0.5">
      {count || 0}
    </span>
  );
};

const EventTypeFilterCheckbox: React.FC<{
  eventType: MidiMessageType;
}> = ({ eventType }) => {
  const activeInputId = useStore((state) => state.activeInputId);
  const checked = useStore(
    (state) => state.filter[activeInputId].eventType[eventType]
  );
  const setEventTypeFilter = useStore((state) => state.setEventTypeFilter);
  return (
    <input
      type="checkbox"
      checked={checked || false}
      onChange={(event) => {
        setEventTypeFilter(activeInputId, eventType, event.target.checked);
      }}
    />
  );
};

const eventTypesRenderData: {
  type: MidiMessageType | "__SEPARATOR__";
  label: string;
  defaultEnabled?: boolean;
}[] = [
  {
    type: "__SEPARATOR__",
    label: "Channel Voice Messages",
  },
  {
    type: MidiMessageType.noteoff,
    label: "Note Off",
    defaultEnabled: true,
  },
  {
    type: MidiMessageType.noteon,
    label: "Note On",
  },
  {
    type: MidiMessageType.channelaftertouch,
    label: "Polyphonic Key Pressure",
  },
  {
    type: MidiMessageType.controlchange,
    label: "Control Change",
  },
  {
    type: MidiMessageType.programchange,
    label: "Program Change",
  },
  {
    type: MidiMessageType.keyaftertouch,
    label: "Channel Pressure",
  },
  {
    type: MidiMessageType.pitchbend,
    label: "Pitch Bend Change",
  },
  {
    type: "__SEPARATOR__",
    label: "Channel Mode Messages",
  },
  {
    type: MidiMessageType.channelmode,
    label: "Channel Mode",
  },
  {
    type: "__SEPARATOR__",
    label: "System Common Messages",
  },
  {
    type: MidiMessageType.sysex,
    label: "System Exclusive",
  },
  {
    type: MidiMessageType.timecode,
    label: "Time Code Quarter Frame",
  },
  {
    type: MidiMessageType.songposition,
    label: "Song Position Pointer",
  },
  {
    type: MidiMessageType.songselect,
    label: "Song Select",
  },
  {
    type: MidiMessageType.tuningrequest,
    label: "Tune Request",
  },
  {
    type: "__SEPARATOR__",
    label: "System Real-Time Messages",
  },
  {
    type: MidiMessageType.activesensing,
    label: "Active Sensing",
  },
  {
    type: MidiMessageType.clock,
    label: "Timing Clock",
  },
  {
    type: MidiMessageType.start,
    label: "Start",
  },
  {
    type: MidiMessageType.continue,
    label: "Continue",
  },
  {
    type: MidiMessageType.stop,
    label: "Stop",
  },
  {
    type: MidiMessageType.reset,
    label: "Reset",
  },
];

export const ExpandedContent: React.FC = () => {
  const activeInputId = useStore((state) => state.activeInputId);
  const setNumericalFormat = useStore((state) => state.setNumericalFormat);

  return (
    <div className="space-y-3">
      <section>
        <div className="mb-1">
          <div className="text-sm font-bold">Device</div>
          <div className="ml-1 text-gray-400 text-xs font-thin">
            Filter messages to those received from this MIDI device.
          </div>
        </div>
        <InputSelect name="activeInputId" id="activeInputId" />
      </section>

      {activeInputId && (
        <>
          <section>
            <div className="mb-1">
              <div className="text-sm font-bold">Numerical Format</div>
              <div className="ml-1 text-gray-400 text-xs font-thin">
                Change the format of MIDI message data.
              </div>
            </div>
            <select
              name="midiDataRepresentation"
              id="midiDataRepresentation"
              className="text-gray-800 w-full"
              onChange={(event) => {
                setNumericalFormat(
                  event.target.value as MidiDataNumericalFormat
                );
              }}
            >
              <option value="binary">Binary</option>
              <option value="decimal">Decimal</option>
            </select>
          </section>

          <section>
            <div className="mb-1">
              <div className="text-sm font-bold">Events</div>
              <div className="ml-1 text-gray-400 text-xs font-thin">
                <span>
                  Filter displayed events by type. For explanations, consult the
                </span>{" "}
                <a
                  href="https://www.midi.org/specifications-old/item/table-1-summary-of-midi-message"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-gray-300"
                >
                  official MIDI message summary.
                </a>
              </div>
            </div>

            {eventTypesRenderData.map((data) => {
              const id = `${data.type}_EventFilter`;

              if (data.type === "__SEPARATOR__") {
                return (
                  <div key={data.label} className="text-xs font-bold mb-1 mt-1">
                    <span>{data.label}</span>
                  </div>
                );
              }

              return (
                <label
                  key={id}
                  className="flex items-center ml-1.5 space-x-1 hover:text-gray-400 hover:underline"
                >
                  <EventTypeFilterCheckbox eventType={data.type} />
                  <span className="text-sm">{data.label}</span>
                  <EventTypeCount eventType={data.type} />
                </label>
              );
            })}
          </section>
        </>
      )}
    </div>
  );
};
