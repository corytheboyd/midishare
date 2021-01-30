import { Request, Response, NextFunction } from "express";
import { getAuthContext } from "../getAuthContext";

export function requiresAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const context = getAuthContext(req);

  if (!context.isAuthenticated()) {
    res.status(401);
    res.contentType("text");
    res.send("Unauthorized");
    return;
  }

  next();
}
