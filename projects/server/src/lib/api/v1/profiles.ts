import { Router } from "express";
import { fromRequest } from "../../getOpenIdContext";

export const profiles = (): Router => {
  const router = Router();

  router.get("/me", async (req, res) => {
    const context = fromRequest(req);

    if (!context.isAuthenticated()) {
      res.status(204);
      res.contentType("text");
      res.send("Unauthorized");
      return;
    }

    res.status(200);
    res.send(context.user);
  });

  return router;
};
