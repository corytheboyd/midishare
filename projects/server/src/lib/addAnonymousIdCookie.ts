import { Request, Response, NextFunction } from "express";
import { v4 as uuid } from "uuid";

export const ANONYMOUS_ID_COOKIE_NAME = "anonymousId";

/**
 * Adds a signed anonymousId cookie to every request.
 *
 * This ID will be used to identify unauthorized users, which will be guests
 * joining sessions. This is less about tracking every move of the user and
 * more about assigning SOME identifier to cookies to allow reconnection on
 * page reload, etc.
 * */
export const addAnonymousIdCookie = () => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.signedCookies[ANONYMOUS_ID_COOKIE_NAME]) {
    const anonymousId = uuid();
    res.cookie(ANONYMOUS_ID_COOKIE_NAME, anonymousId, {
      domain: (() => {
        const url = new URL(process.env.CLIENT_URL as string);
        return url.hostname;
      })(),
      maxAge: 12 * 60 * 60, // 12 hours
      signed: true,
    });
  }
  next();
};
