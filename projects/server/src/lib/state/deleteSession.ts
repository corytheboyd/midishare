import { Session, UserId } from "@midishare/common";
import { redisClient } from "./redisClient";

export const SESSIONS_HASH_NAME = "sessions";
export const SESSION_IDS_BY_USER_ID_SET_NAME = (userId: UserId): string =>
  `sessions|${userId}`;

/**
 * Deletes a session, as well as the cached set of session IDs for the host
 * user.
 * */
export async function deleteSession(session: Session): Promise<void> {
  return new Promise((resolve, reject) => {
    redisClient
      .multi()
      .hdel(SESSIONS_HASH_NAME, session.id)
      .del(SESSION_IDS_BY_USER_ID_SET_NAME(session.participants.host))
      .exec((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
  });
}
