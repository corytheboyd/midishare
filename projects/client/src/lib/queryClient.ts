import { QueryClient } from "react-query";

export enum Queries {
  PROFILES = "PROFILES",
  SESSIONS = "SESSIONS",
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // TODO consider adding this again? production only?
      refetchOnWindowFocus: false,
    },
  },
});
