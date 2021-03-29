import { db } from "./db";
import { v4 as generateUuid } from "uuid";
import { Session, UserId } from "@midishare/common";

export async function createSession(userId: UserId): Promise<Session> {
  const uuid = generateUuid();

  await db.run("INSERT INTO Sessions (uuid, hostId) VALUES (:uuid, :userId)", {
    ":userId": userId,
    ":uuid": uuid,
  });

  return {
    id: uuid,
    participants: {
      host: userId,
    },
    runtimeOptions: {
      host: {
        sustainInverted: false,
      },
      guest: {
        sustainInverted: false,
      },
    },
  };
}
