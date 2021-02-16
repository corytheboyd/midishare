import { Request, Response } from "express";
import { RequestContext, ResponseContext } from "express-openid-connect";
import { UserinfoResponse } from "openid-client";

export interface RequestContextWithUser extends RequestContext {
  user?: UserinfoResponse;
}

export function fromRequest(request: Request): RequestContextWithUser {
  const requestWithContext = request as typeof request & {
    oidc: RequestContextWithUser;
  };
  return requestWithContext.oidc;
}

export function fromResponse(response: Response): ResponseContext {
  const requestWithContext = response as typeof response & {
    oidc: ResponseContext;
  };
  return requestWithContext.oidc;
}
