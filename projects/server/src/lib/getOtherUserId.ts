import { Session, UserId } from "@midishare/common";

export function getOtherUserId(
  session: Session,
  userId: UserId
): UserId | undefined {
  if (session.participants.host === userId) {
    return session.participants.guest;
  } else if (session.participants.guest === userId) {
    return session.participants.host;
  }
  return;
}
