import { Router } from "express";
import { attemptSilentLogin } from "express-openid-connect";
import { getAuthContext } from "../../getAuthContext";

export const profiles = (): Router => {
  const router = Router();

  router.get("/me", attemptSilentLogin(), async (req, res) => {
    const context = getAuthContext(req);

    if (!context.isAuthenticated()) {
      res.status(401);
      res.end();
      return;
    }

    res.send(context.user);
  });

  return router;
};
