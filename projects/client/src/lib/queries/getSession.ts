import { Session } from "@midishare/common";
import { Queries } from "../queryClient";

export function queryKey(id: string): string[] {
  return [Queries.SESSIONS, id];
}

/**
 * Resolves to null if Session not found (404)
 * */
export async function getSession(id: string): Promise<Session | null> {
  const url = new URL(process.env.SERVER_URL as string);
  url.pathname = `/api/v1/sessions/${id}`;

  const response = await fetch(url.toString(), {
    mode: "cors",
    credentials: "include",
  });

  if (response.status === 404) {
    return null;
  } else if (!response.ok) {
    throw new Error("Something went wrong fetching session");
  }

  return response.json();
}
