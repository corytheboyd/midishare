import * as React from "react";
import { useStore } from "../../../store";

type InputSelectProps = {
  name: string;
  id: string;
};

export const InputSelect: React.FC<InputSelectProps> = ({ name, id }) => {
  const inputs = useStore((state) => state.inputs);

  return (
    <select name={name} id={id}>
      {inputs.map((input) => (
        <option key={input.id} value={input.id}>
          {input.name}
        </option>
      ))}
    </select>
  );
};
