import * as React from "react";
import { BaseMessage } from "../../../store";

type MessageProps = {
  message: BaseMessage;
};

export const Message: React.FC<MessageProps> = ({ message }) => {
  return <div className="w-full font-mono font-thin">{message.type}</div>;
};
