import { Session, UserId } from "@midishare/common";
import { redisClient } from "./redisClient";
import {
  SESSION_IDS_BY_USER_ID_SET_NAME,
  SESSIONS_HASH_NAME,
} from "./createSession";

export async function getAllSessions(userId: UserId): Promise<Session[]> {
  return new Promise((resolve, reject) => {
    redisClient.smembers(
      SESSION_IDS_BY_USER_ID_SET_NAME(userId),
      (err, members) => {
        if (err) {
          reject(err);
          return;
        }

        redisClient.hmget(SESSIONS_HASH_NAME, ...members, (err, values) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(values.map((value) => JSON.parse(value)));
        });
      }
    );
  });
}
