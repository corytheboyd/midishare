import { Router } from "express";
import { fromRequest } from "../../getOpenIdContext";
import { requiresAuth } from "express-openid-connect";

export const profiles = (): Router => {
  const router = Router();

  router.get("/me", requiresAuth(), async (req, res) => {
    const context = fromRequest(req);
    res.send(context.user);
  });

  return router;
};
