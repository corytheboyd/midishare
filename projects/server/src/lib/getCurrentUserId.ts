import { Request } from "express";
import { fromRequest } from "./getOpenIdContext";
import { ANONYMOUS_ID_COOKIE_NAME } from "./addAnonymousIdCookie";

/**
 * Helper function to get the ID of the current user (of the request).
 *
 * If the user has an account and is logged in, their sub value is returned.
 * Otherwise, the value of the anonymousId cookie is returned.
 *
 * The anonymousId cookie ise by the addAnonymousIdCookie middleware.
 * @see projects/server/src/lib/addAnonymousIdCookie.ts
 * */
export function getCurrentUserId(req: Request): string {
  const context = fromRequest(req);
  const anonymousId = req.signedCookies[ANONYMOUS_ID_COOKIE_NAME];

  if (context.isAuthenticated()) {
    if (!context.user) {
      return anonymousId;
    }
    return context.user.sub;
  }

  return anonymousId;
}
