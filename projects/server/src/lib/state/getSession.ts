import { redisClient } from "./redisClient";
import { SESSIONS_HASH_NAME } from "./createSession";
import { Session } from "@midishare/common";

export function getSession(id: string): Promise<Session> {
  return new Promise((resolve, reject) => {
    redisClient.hget(SESSIONS_HASH_NAME, id, (error, value) => {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(value));
      }
    });
  });
}
