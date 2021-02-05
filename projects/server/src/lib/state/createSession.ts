import { Session } from "@midishare/common";
import { v4 as uuid } from "uuid";
import { redisClient } from "./redisClient";

export const SESSIONS_HASH_NAME = "sessions";

export async function createSession(
  partial: Omit<Session, "id">
): Promise<Session> {
  const session = {
    id: uuid(),
    ...partial,
  };

  return new Promise((resolve, reject) => {
    redisClient.hset(
      SESSIONS_HASH_NAME,
      session.id,
      JSON.stringify(session),
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(session);
        }
      }
    );
  });
}
