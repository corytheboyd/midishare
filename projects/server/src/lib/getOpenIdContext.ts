import { Request, Response } from "express";
import { RequestContext, ResponseContext } from "express-openid-connect";

export function fromRequest(request: Request): RequestContext {
  const requestWithContext = request as typeof request & {
    oidc: RequestContext;
  };
  return requestWithContext.oidc;
}

export function fromResponse(response: Response): ResponseContext {
  const requestWithContext = response as typeof response & {
    oidc: ResponseContext;
  };
  return requestWithContext.oidc;
}
