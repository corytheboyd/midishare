import { Router } from "express";
import { requiresAuth } from "express-openid-connect";
import { v4 as uuid } from "uuid";
import { Session } from "@midishare/common";
import { fromRequest } from "../../getOpenIdContext";

export const sessions = (): Router => {
  const router = Router();

  router.use(requiresAuth());

  router.get("/:id", (req, res) => {
    res.send("ROOMS INDEX");
  });

  router.post("/", (req, res) => {
    const context = fromRequest(req);
    const newSession: Session = {
      id: uuid(),
      participants: {
        host: context.user!.sub,
      },
    };
    res.status(201);
    res.send(newSession);
  });

  router.post("/:roomId/join", (req, res) => {
    res.send(`JOIN ROOM: ${req.params.roomId}`);
  });

  return router;
};
