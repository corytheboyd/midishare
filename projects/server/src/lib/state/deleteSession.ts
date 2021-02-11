import { Session } from "@midishare/common";
import { db } from "./db";

export async function deleteSession(session: Session): Promise<void> {
  await db.run("DELETE FROM Sessions WHERE uuid = ?", session.id);
}
