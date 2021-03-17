import { Session } from "@midishare/common";

export async function setSustainInverted(
  id: string,
  value: boolean
): Promise<Session> {
  const url = new URL(process.env.SERVER_URL as string);
  url.pathname = `/api/v1/sessions/${id}/setSustainInverted`;
  url.searchParams.append("value", value ? "1" : "0");

  const response = await fetch(url.toString(), {
    method: "POST",
    mode: "cors",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Something went wrong creating session");
  }

  return response.json();
}
