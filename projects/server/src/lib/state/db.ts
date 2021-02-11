import sqlite3 from "sqlite3";
import { open } from "sqlite";

/**
 * This is slick, thanks StackOverflow lol
 * @see https://stackoverflow.com/a/49889856/14920432
 * */
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export const dbOpen = open({
  filename: process.env.SQLITE_DATABASE as string,
  driver: sqlite3.Database,
});

export let db: ThenArg<typeof dbOpen>;

dbOpen.then((_db) => {
  db = _db;
});
