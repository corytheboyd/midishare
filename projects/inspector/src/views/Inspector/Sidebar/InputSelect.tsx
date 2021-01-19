import * as React from "react";
import { useStore } from "../../../lib/store";
import { setActiveInput } from "../../../lib/setActiveInput";

type InputSelectProps = {
  name: string;
  id: string;
};

export const InputSelect: React.FC<InputSelectProps> = ({ name, id }) => {
  const inputs = useStore((state) => state.inputs);
  const activeInputId = useStore((state) => state.activeInputId);

  const handleChange = (event) => {
    setActiveInput(event.target.value);
  };

  const options: JSX.Element[] = Object.entries(inputs).map(
    ([deviceId, input]) => (
      <option key={deviceId} value={deviceId}>
        {input.name}
      </option>
    )
  );

  options.unshift(
    <option key="empty" value={""} disabled={true}>
      Select an input
    </option>
  );

  return (
    <select
      name={name}
      id={id}
      className="text-gray-800 w-full"
      onChange={handleChange}
      value={activeInputId || ""}
    >
      {options}
    </select>
  );
};
