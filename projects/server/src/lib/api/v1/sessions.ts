import { Router } from "express";
import { requiresAuth } from "express-openid-connect";
import { v4 as uuid } from "uuid";
import { Session } from "@midishare/common";
import { fromRequest } from "../../getOpenIdContext";
import { getSession } from "../../state/getSession";
import { saveSession } from "../../state/saveSession";

export const sessions = (): Router => {
  const router = Router();

  router.get("/:id", (req, res) => {
    const session = getSession(req.params.id);

    if (!session) {
      res.status(404);
      res.end();
    }

    res.send(session);
  });

  router.post("/", requiresAuth(), (req, res) => {
    const context = fromRequest(req);

    const session: Session = {
      id: uuid(),
      participants: {
        host: context.user!.sub,
      },
    };
    saveSession(session);

    res.status(201);
    res.send(session);
  });

  router.post("/:roomId/join", (req, res) => {
    res.send(`JOIN ROOM: ${req.params.roomId}`);
  });

  return router;
};
