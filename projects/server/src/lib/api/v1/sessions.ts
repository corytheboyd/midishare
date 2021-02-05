import { Router } from "express";
import { attemptSilentLogin, requiresAuth } from "express-openid-connect";
import { v4 as uuid } from "uuid";
import { fromRequest } from "../../getOpenIdContext";
import { getSession } from "../../state/getSession";
import { saveSession } from "../../state/saveSession";
import { Session } from "@midishare/common";
import { getCurrentUserId } from "../../getCurrentUserId";
import { addGuestToSession } from "../../state/addGuestToSession";

export const sessions = (): Router => {
  const router = Router();

  router.get("/:id", (req, res) => {
    const session = getSession(req.params.id);

    if (!session) {
      res.status(404);
      res.end();
      return;
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

  router.post("/:id/join", attemptSilentLogin(), (req, res) => {
    const session = getSession(req.params.id);

    if (!session) {
      res.status(404);
      res.end();
      return;
    }

    const userId = getCurrentUserId(req);
    addGuestToSession(session.id, userId);

    res.send({});
  });

  return router;
};
