import { db } from "./db";

export async function setSustainInverted(
  sessionId: string,
  targetUser: "host" | "guest",
  value: boolean
): Promise<void> {
  const column =
    targetUser === "host" ? "hostSustainInverted" : "guestSustainInverted";

  await db.run(`UPDATE Sessions SET ${column} = :value WHERE uuid = :uuid`, {
    ":value": value ? 1 : 0,
    ":uuid": sessionId,
  });
}
