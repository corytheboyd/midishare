import { DB } from "./deps.ts";

const databasePath = Deno.env.get("SQLITE_DATABASE_PATH");
if (!databasePath) {
  throw new Error("SQLITE_DATABASE_PATH not set");
}

export const db = new DB(databasePath);
