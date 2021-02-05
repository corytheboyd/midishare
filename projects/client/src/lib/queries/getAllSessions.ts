import { Session } from "@midishare/common";
import { Queries } from "../queryClient";

export function queryKey(): string[] {
  return [Queries.SESSIONS];
}

export async function getAllSessions(): Promise<Session[]> {
  const url = new URL(process.env.SERVER_URL as string);
  url.pathname = `/api/v1/sessions`;

  const response = await fetch(url.toString(), {
    mode: "cors",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Something went wrong fetching user profile");
  }

  return response.json();
}
