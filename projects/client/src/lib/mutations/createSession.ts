import { Session } from "@midishare/common";

export async function createSession(): Promise<Session> {
  const url = new URL(process.env.SERVER_URL as string);
  url.pathname = "/api/v1/sessions";

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
