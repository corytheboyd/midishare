import { Router } from "express";
import { requiresAuth } from "express-openid-connect";
import { v4 as uuid } from "uuid";
import { Session } from "@midishare/common";

export const sessions = (): Router => {
  const router = Router();

  router.use(requiresAuth());

  router.get("/", (req, res) => {
    res.send("ROOMS INDEX");
  });

  router.post("/", (req, res) => {
    const newSession: Session = {
      id: uuid(),
    };
    res.status(201);
    setTimeout(() => res.send(newSession), 1000);
  });

  router.post("/:roomId/join", (req, res) => {
    res.send(`JOIN ROOM: ${req.params.roomId}`);
  });

  return router;
};
