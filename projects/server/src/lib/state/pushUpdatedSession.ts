import { Session, UserId } from "@midishare/common";
import { send } from "../ws/connections/send";

/**
 * Publishes Session delta as patch to clients to update their local states.
 * */
export function pushUpdatedSession(userId: UserId, session: Session): void {
  let targetUserId: UserId | undefined;
  if (session.participants.host === userId) {
    targetUserId = session.participants.guest;
  } else if (session.participants.guest === userId) {
    targetUserId = session.participants.host;
  }

  if (!targetUserId) {
    return;
  }

  send("sessionData", targetUserId, JSON.stringify(session));
}
