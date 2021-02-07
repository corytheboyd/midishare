import { Session, WebSocketSubType } from "@midishare/common";
import { queryClient } from "../queryClient";
import { queryKey } from "../queries/getSession";

export function handleSessionDataMessage(message: string): void {
  let session: Session;
  try {
    session = JSON.parse(message);
  } catch (error) {
    console.warn(
      `WS[type="${WebSocketSubType.SESSION_DATA}"]: failed to parse message`,
      message
    );
    return;
  }

  queryClient.setQueryData(queryKey(session.id), session);

  console.warn(
    `WS[type="${WebSocketSubType.SESSION_DATA}"]: session updated`,
    queryClient.getQueryCache()
  );
}
