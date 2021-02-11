import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const db = open({
  filename: process.env.SQLITE_DATABASE as string,
  driver: sqlite3.Database,
});
