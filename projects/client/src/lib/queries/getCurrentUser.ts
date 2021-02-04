import { UserProfile } from "@midishare/common";
import { Queries } from "../queryClient";

export function queryKey(): string[] {
  return [Queries.PROFILES, "me"];
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const url = new URL(process.env.SERVER_URL as string);
  url.pathname = `/api/v1/profiles/me`;

  const response = await fetch(url.toString(), {
    mode: "cors",
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  } else if (!response.ok) {
    throw new Error("Something went wrong fetching user profile");
  }

  return response.json();
}
