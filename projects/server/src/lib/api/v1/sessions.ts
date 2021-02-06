import { Router } from "express";
import { requiresAuth } from "express-openid-connect";
import { fromRequest } from "../../getOpenIdContext";
import { getSession } from "../../state/getSession";
import { getCurrentUserId } from "../../getCurrentUserId";
import { createSession } from "../../state/createSession";
import { updateSession } from "../../state/updateSession";
import { getAllSessions } from "../../state/getAllSessions";
import { deleteSession } from "../../state/deleteSession";

export const sessions = (): Router => {
  const router = Router();

  router.get(
    "/",
    requiresAuth(() => false),
    async (req, res) => {
      const userId = getCurrentUserId(req);
      const sessions = await getAllSessions(userId);
      res.send(sessions);
    }
  );

  router.get("/:id", async (req, res) => {
    const session = await getSession(req.params.id);

    if (!session) {
      res.status(404);
      res.end();
      return;
    }

    res.send(session);
  });

  router.post("/", requiresAuth(), async (req, res) => {
    const context = fromRequest(req);

    const userId = getCurrentUserId(req);
    const session = await createSession(userId, {
      participants: {
        host: context.user!.sub,
      },
    });

    res.status(201);
    res.send(session);
  });

  router.post(
    "/:id/join",
    requiresAuth(() => false),
    async (req, res) => {
      const session = await getSession(req.params.id);

      if (!session) {
        res.status(404);
        res.end();
        return;
      }

      const userId = getCurrentUserId(req);
      const updatedSession = await updateSession(session.id, userId, {
        participants: {
          guest: userId,
        },
      });
      res.send(updatedSession);
    }
  );

  router.delete("/:id", requiresAuth(), async (req, res) => {
    const userId = getCurrentUserId(req);
    const session = await getSession(req.params.id);

    if (session.participants.host !== userId) {
      res.status(404);
      res.end();
      return;
    }

    await deleteSession(session);

    res.status(204);
    res.end();
  });

  return router;
};
