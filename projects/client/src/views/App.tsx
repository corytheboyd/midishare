import React from "react";
import { useQuery } from "react-query";
import { Queries } from "../lib/queryClient";

export const App: React.FC = () => {
  const { isLoading, error, data, isFetching } = useQuery(
    [Queries.PROFILES, "me"],
    async () => {
      const url = new URL(process.env.SERVER_URL as string);
      url.pathname = `/api/v1/profiles/me`;

      const response = await fetch(url.toString());

      if (response.status === 204) {
        return null;
      } else if (response.status === 200) {
        return await response.json();
      }
    }
  );

  return (
    <div>
      <h1>Midishare</h1>
      <div>
        <h2>Data</h2>
        <code>{JSON.stringify(data)}</code>
      </div>
      <div>
        <h2>Error</h2>
        <code>{JSON.stringify(error)}</code>
      </div>
    </div>
  );
};
