import { Router } from "express";
import { requiresAuth } from "express-openid-connect";

export const rooms = (): Router => {
  const router = Router();

  router.use(requiresAuth());

  router.get("/", (req, res) => {
    res.send("ROOMS INDEX");
  });

  router.post("/", (req, res) => {
    res.send("CREATE ROOM");
  });

  router.post("/:roomId/join", (req, res) => {
    res.send(`JOIN ROOM: ${req.params.roomId}`);
  });

  return router;
};
