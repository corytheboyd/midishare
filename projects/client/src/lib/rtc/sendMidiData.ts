import { remoteMidiDataChannel } from "./usePeerConnection";

export function sendMidiData(data: Uint8Array, timestamp: number): void {
  if (!remoteMidiDataChannel) {
    console.warn("REMOTE DATA CHANNEL NOT CREATED!");
    return;
  }

  const message: (string | number)[] = [timestamp.toFixed(3)];
  for (const value of data) {
    message.push(value);
  }

  remoteMidiDataChannel.send(message.join(","));
}
