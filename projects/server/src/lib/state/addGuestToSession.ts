import { UserId } from "@midishare/common";
import { db } from "./db";

export async function addGuestToSession(
  guestId: UserId,
  sessionId: string
): Promise<void> {
  await db.run(
    "UPDATE Sessions SET guestId = :guestId WHERE uuid = :sessionId",
    {
      ":guestId": guestId,
      ":sessionId": sessionId,
    }
  );
}
