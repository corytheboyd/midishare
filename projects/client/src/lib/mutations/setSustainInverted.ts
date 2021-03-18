import { Session } from "@midishare/common";

export async function setSustainInverted(variables: {
  id: string;
  value: boolean;
}): Promise<Session> {
  const url = new URL(process.env.SERVER_URL as string);
  url.pathname = `/api/v1/sessions/${variables.id}/setSustainInverted`;
  url.searchParams.append("value", variables.value ? "1" : "0");

  const response = await fetch(url.toString(), {
    method: "POST",
    mode: "cors",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Something went wrong updating session");
  }

  return response.json();
}
