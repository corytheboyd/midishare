import { Router } from "express";
import { requiresAuth } from "express-openid-connect";

export const sessions = (): Router => {
  const router = Router();

  router.use(requiresAuth());

  router.get("/", (req, res) => {
    res.send("ROOMS INDEX");
  });

  router.post("/", (req, res) => {
    setTimeout(() => {
      res.send("CREATE ROOM");
    }, 1000);
  });

  router.post("/:roomId/join", (req, res) => {
    res.send(`JOIN ROOM: ${req.params.roomId}`);
  });

  return router;
};
