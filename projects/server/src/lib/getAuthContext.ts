import { Request } from "express";
import { RequestContext } from "express-openid-connect";

export function getAuthContext(request: Request): RequestContext {
  const requestWithContext = (request as unknown) as Request & {
    oidc: RequestContext;
  };

  // Check to see if it actually contains the request context
  if (!requestWithContext.oidc) {
    throw new Error(
      "Request object invalid! Was the express-openid-connect middleware mounted?"
    );
  }

  return requestWithContext.oidc;
}
