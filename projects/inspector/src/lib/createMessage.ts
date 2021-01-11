import { Message, MessageType } from "../store";
import { v4 as uuid } from "uuid";

export function createMessage(
  type: MessageType,
  properties: Partial<Message>
): Message {
  return {
    type,
    uuid: uuid(),
    timestamp: performance.now(),
    ...properties,
  };
}
