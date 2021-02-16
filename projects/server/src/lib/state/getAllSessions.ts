import { Session, UserId } from "@midishare/common";
import { db } from "./db";
import { SessionRow } from "./types";

export async function getAllSessions(userId: UserId): Promise<Session[]> {
  const data = await db.all<
    Required<Pick<SessionRow, "uuid" | "hostId" | "guestId">>[]
  >(
    "SELECT uuid, hostId, guestId FROM Sessions WHERE hostId = :userId OR guestId = :userId",
    { ":userId": userId }
  );

  if (!data) {
    return [];
  }

  return data.map((d) => ({
    id: d.uuid,
    participants: {
      host: d.hostId,
      guest: d.guestId,
    },
  }));
}
