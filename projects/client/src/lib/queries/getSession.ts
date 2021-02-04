import { Session } from "@midishare/common";
import { Queries } from "../queryClient";

export function queryKey(id: string): string[] {
  return [Queries.SESSIONS, id];
}

export async function getSession(id: string): Promise<Session> {
  const url = new URL(process.env.SERVER_URL as string);
  url.pathname = `/api/v1/sessions/${id}`;

  const response = await fetch(url.toString(), {
    mode: "cors",
    credentials: "include",
  });

  if (response.status === 404) {
    throw new Error("Session not found");
  } else if (!response.ok) {
    throw new Error("Something went wrong fetching session");
  }

  return response.json();
}
