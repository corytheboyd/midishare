import * as React from "react";
import {
  Message as MessageType,
  MessageType as MessageTypeEnum,
} from "../../../store";

type MessageProps = {
  message: MessageType;
};

export const Message: React.FC<MessageProps> = ({ message }) => {
  let content: JSX.Element = null;
  switch (message.type) {
    case MessageTypeEnum.Connection: {
      content = <div>connection message</div>;
      break;
    }
    case MessageTypeEnum.MidiData: {
      content = <div>midi message</div>;
      break;
    }
  }

  return <div className="w-full font-mono font-thin">{content}</div>;
};
