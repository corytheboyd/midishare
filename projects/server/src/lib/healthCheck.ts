import { Router } from "express";

export const healthCheck = (): Router => {
  const router = Router();

  router.get("/", (req, res) => {
    res.status(200);
    res.send("OK");
  });

  return router;
};
