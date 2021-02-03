import React, { ChangeEvent, useState } from "react";
import { ExclamationCircle } from "../common/icons/sm/ExclamationCircle";
import { Button } from "../common/Button";
import { Plus } from "../common/icons/sm/Plus";
import { getMidiAccess } from "../../lib/getMidiAccess";
import { useStore } from "../../lib/store";

const GetAccessButton: React.FC = () => {
  const handleAttachMidiKeyboard = () => {
    getMidiAccess();
  };

  return (
    <Button
      className="flex items-center bg-white text-black px-2 py-1 rounded"
      onClick={handleAttachMidiKeyboard}
    >
      <div className="w-5 h-5">
        <Plus />
      </div>
      <span>Attach MIDI Keyboard</span>
    </Button>
  );
};

const DeviceSelect: React.FC = () => {
  const midiInputDevices = useStore((state) => state.midiInputDevices);
  const activeMidiInputDeviceId = useStore(
    (state) => state.activeMidiInputDeviceId
  );
  const setActiveMidiInputDeviceId = useStore(
    (state) => state.setActiveMidiInputDeviceId
  );

  if (midiInputDevices.length === 0) {
    return (
      <span className="text-sm text-red-500">
        No MIDI keyboard connected, please connect one and this prompt will
        update shortly after...
      </span>
    );
  }

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) =>
    setActiveMidiInputDeviceId(event.target.value);

  return (
    <div className="flex flex-col items-center space-y-2">
      <select
        className="text-sm bg-gray-500 rounded-sm"
        value={activeMidiInputDeviceId || ""}
        onChange={handleChange}
      >
        <option value={""}>Select a MIDI device</option>
        {midiInputDevices.map((input) => (
          <option key={input.id} value={input.id}>
            {input.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export const AttachMidiPrompt: React.FC = () => {
  const midiAccessGranted = useStore((state) => state.midiAccessGranted);

  return (
    <div className="flex items-center space-x-1">
      <div className="w-96 flex flex-col items-center text-center space-y-3 p-3">
        <div className="h-10 w-10">
          <ExclamationCircle />
        </div>

        <p className="text-sm">
          You need to connect a MIDI keyboard to send your keyboard inputs to
          the other person
        </p>

        {midiAccessGranted === null && <GetAccessButton />}

        {midiAccessGranted === false && (
          <span className="text-sm text-red-500">
            Aww gee, MIDI access not granted
          </span>
        )}

        {midiAccessGranted === true && <DeviceSelect />}
      </div>
    </div>
  );
};
