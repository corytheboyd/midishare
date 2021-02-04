import { QueryClient } from "react-query";

export enum Queries {
  PROFILES = "PROFILES",
  SESSIONS = "SESSIONS",
}

export const queryClient = new QueryClient();
