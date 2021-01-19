import * as React from "react";
import { InputSelect } from "./InputSelect";
import { DeviceId, useStore } from "../../../lib/store";
import { InputEvents } from "webmidi";

const EventTypeCount: React.FC<{
  activeInputId: DeviceId;
  eventType: keyof InputEvents;
}> = ({ activeInputId, eventType }) => {
  const count = useStore(
    (state) => state.eventsCount[activeInputId][eventType]
  );

  return (
    <span className="bg-gray-700 text-gray-200 text-xs px-0.5">
      {count || 0}
    </span>
  );
};

const eventTypesRenderData: {
  type: keyof InputEvents | null;
  label: string;
}[] = [
  {
    type: null,
    label: "Channel Voice Messages",
  },
  {
    type: "noteoff",
    label: "Note Off",
  },
  {
    type: "noteon",
    label: "Note On",
  },
  {
    type: "channelaftertouch",
    label: "Polyphonic Key Pressure",
  },
  {
    type: "controlchange",
    label: "Control Change",
  },
  {
    type: "programchange",
    label: "Program Change",
  },
  {
    type: "keyaftertouch",
    label: "Channel Pressure",
  },
  {
    type: "pitchbend",
    label: "Pitch Bend Change",
  },
  {
    type: null,
    label: "Channel Mode Messages",
  },
  {
    type: "channelmode",
    label: "Channel Mode",
  },
  {
    type: null,
    label: "System Common Messages",
  },
  {
    type: "sysex",
    label: "System Exclusive",
  },
  {
    type: "timecode",
    label: "Time Code Quarter Frame",
  },
  {
    type: "songposition",
    label: "Song Position Pointer",
  },
  {
    type: "songselect",
    label: "Song Select",
  },
  {
    type: "tuningrequest",
    label: "Tune Request",
  },
  {
    type: null,
    label: "System Real-Time Messages",
  },
  {
    type: "activesensing",
    label: "Active Sensing",
  },
  {
    type: "clock",
    label: "Timing Clock",
  },
  {
    type: "start",
    label: "Start",
  },
  {
    type: "continue",
    label: "Continue",
  },
  {
    type: "stop",
    label: "Stop",
  },
  {
    type: "reset",
    label: "Reset",
  },
];

export const ExpandedContent: React.FC = () => {
  const activeInputId = useStore((state) => state.activeInputId);

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="activeInputId">
          <div className="mb-1">
            <div className="text-sm font-bold">Device</div>
            <div className="ml-1 text-gray-400 text-xs font-thin">
              Filter messages to those received from this MIDI device.
            </div>
          </div>
          <InputSelect name="activeInputId" id="activeInputId" />
        </label>
      </div>

      {activeInputId && (
        <div>
          <label>
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

              if (data.type === null) {
                return (
                  <div key={data.label} className="text-xs font-bold mb-1 mt-1">
                    <span>{data.label}</span>
                  </div>
                );
              }

              return (
                <label key={id} htmlFor={id}>
                  <div className="flex items-center space-x-1 ml-1">
                    <input type="checkbox" id={id} />
                    <span className="text-sm">{data.label}</span>
                    <EventTypeCount
                      activeInputId={activeInputId}
                      eventType={data.type}
                    />
                  </div>
                </label>
              );
            })}
          </label>
        </div>
      )}
    </div>
  );
};
