export async function deleteSession(id: string): Promise<void> {
  const url = new URL(process.env.SERVER_URL as string);
  url.pathname = `/api/v1/sessions/${id}`;

  const response = await fetch(url.toString(), {
    method: "DELETE",
    mode: "cors",
    credentials: "include",
  });

  if (response.status === 404) {
    throw new Error("Session not found");
  } else if (!response.ok) {
    throw new Error("Something went wrong deleting session");
  }
}
