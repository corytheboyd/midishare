import { Session, UserId } from "@midishare/common";
import { v4 as uuid } from "uuid";
import { redisClient } from "./redisClient";

export const SESSIONS_HASH_NAME = "sessions";
export const SESSION_IDS_BY_USER_ID_SET_NAME = (userId: UserId): string =>
  `sessions|${userId}`;

/**
 * Creates a new session and persist it.
 *
 * Note: Also, adds new session ID to set of IDs keyed by user for fast
 * retrieval. This is overkill for session, but adding it anyway for reference
 * while I am close to the Redis logic.
 * */
export async function createSession(
  userId: UserId,
  partial: Omit<Session, "id" | "createdAt" | "updatedAt">
): Promise<Session> {
  return new Promise((resolve, reject) => {
    const session = {
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...partial,
    };

    redisClient
      .multi()
      .hset(SESSIONS_HASH_NAME, session.id, JSON.stringify(session))
      .sadd(SESSION_IDS_BY_USER_ID_SET_NAME(userId), session.id)
      .exec((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(session);
        }
      });
  });
}
