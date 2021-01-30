import { QueryClient } from "react-query";

export enum Queries {
  PROFILES = "PROFILES",
}

export const queryClient = new QueryClient();
