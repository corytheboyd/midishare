import { Session } from "@midishare/common";
import { db } from "./db";
import { SessionRow } from "./types";

export async function getSession(id: string): Promise<Session> {
  const data = await db.get<
    Required<Pick<SessionRow, "uuid" | "hostId" | "guestId">>
  >("SELECT uuid, hostId, guestId FROM Sessions WHERE uuid = ?", id);

  if (!data) {
    throw new Error("Session does not exist");
  }

  return {
    id: data.uuid,
    participants: {
      host: data.hostId,
      guest: data.guestId,
    },
  };
}
