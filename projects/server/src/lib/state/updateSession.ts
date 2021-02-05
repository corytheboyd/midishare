import { Session } from "@midishare/common";
import deepmerge from "deepmerge";
import { SESSIONS_HASH_NAME } from "./createSession";
import { redisClient } from "./redisClient";

/**
 * Shamelessly stolen from StackOverflow
 *
 * @see https://stackoverflow.com/questions/47914536/use-partial-in-nested-property-with-typescript
 * */
export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

const UPDATE_LOCK_TIMEOUT_SECONDS = 3;

/**
 * Updates an existing session from a partial patch.
 *
 * Care was taken to prevent concurrent write race conditions with an
 * optimistic locking heavily inspired by this SO answer:
 * https://stackoverflow.com/questions/9145827/redis-py-watch-hash-key
 *
 * The optimistic locking logic should be extracted if we need it for
 * anything else at all, given how meticulous it is.
 * */
export async function updateSession(
  id: string,
  partial: Omit<RecursivePartial<Session>, "id" | "createdAt" | "updatedAt">
): Promise<Session> {
  return new Promise((resolve, reject) => {
    const lockKey = `${SESSIONS_HASH_NAME}|lock|${id}`;
    redisClient.watch(lockKey);
    redisClient.hget(SESSIONS_HASH_NAME, id, (err, value) => {
      if (err) {
        redisClient.unwatch();
        reject(err);
        return;
      }

      if (!value) {
        redisClient.unwatch();
        return;
      }

      const session: Session = JSON.parse(value);
      let updatedSession: Session;
      try {
        updatedSession = deepmerge(session, {
          ...partial,
          updatedAt: new Date().toISOString(),
        }) as Session;
      } catch (error) {
        redisClient.unwatch();
        reject(error);
        return;
      }

      redisClient
        .multi()
        .set(lockKey, "")
        .expire(lockKey, UPDATE_LOCK_TIMEOUT_SECONDS)
        .hset(SESSIONS_HASH_NAME, id, JSON.stringify(updatedSession))
        .exec((err, reply) => {
          if (err) {
            reject(err);
            return;
          }

          // Per the documentation, null reply is returned if execution was
          // aborted.
          // https://redis.io/commands/exec
          if (!reply) {
            // TODO decide if we should auto-retry or not. For now, just
            //  explode to get attention
            reject(
              new Error(
                `Failed to update Session[id=${id}. Modified during transaction`
              )
            );
            return;
          }

          resolve(updatedSession);
        });
    });
  });
}
