import { Session, WebSocketSubType } from "@midishare/common";
import { queryClient } from "../queryClient";
import { queryKey } from "../queries/getSession";

export function handleSessionDataMessage(data: string): void {
  let session: Session;
  try {
    session = JSON.parse(data);
  } catch (error) {
    console.warn(
      `WS[type="${WebSocketSubType.SESSION_DATA}"]: failed to parse message`,
      data
    );
    return;
  }

  queryClient.setQueryData(queryKey(session.id), session);

  console.warn(
    `WS[type="${WebSocketSubType.SESSION_DATA}"]: session updated`,
    queryClient.getQueryCache()
  );
}
