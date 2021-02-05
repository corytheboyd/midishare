import { Session } from "@midishare/common";

export async function joinSession(id: string): Promise<Session> {
  const url = new URL(process.env.SERVER_URL as string);
  url.pathname = `/api/v1/sessions/${id}/join`;

  const response = await fetch(url.toString(), {
    method: "POST",
    mode: "cors",
    credentials: "include",
  });

  if (response.status !== 201) {
    throw new Error("Failed to create session");
  } else if (!response.ok) {
    throw new Error("Something went wrong creating session");
  }

  return response.json();
}
