import { QueryClient } from "react-query";

export enum Queries {
  PROFILES = "PROFILES",
  SESSIONS = "SESSIONS",
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // TODO also reconsider this, but for now it seems wise to just keep it
      //  simple.
      retry: false,

      // TODO consider adding this again? production only?
      refetchOnWindowFocus: false,
    },
  },
});
