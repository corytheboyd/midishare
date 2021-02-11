import { Router } from "express";
import { requiresAuth } from "express-openid-connect";
import { getSession } from "../../state/getSession";
import { getCurrentUserId } from "../../getCurrentUserId";
import { createSession } from "../../state/createSession";
import { addGuestToSession } from "../../state/addGuestToSession";
import { getAllSessions } from "../../state/getAllSessions";
import { deleteSession } from "../../state/deleteSession";
import { send } from "../../ws/connections/send";
import { WebSocketSubType } from "@midishare/common";

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
    const userId = getCurrentUserId(req);
    const session = await createSession(userId);

    res.status(201);
    res.send(session);
  });

  router.post(
    "/:id/join",
    requiresAuth(() => false),
    async (req, res) => {
      const userId = getCurrentUserId(req);
      await addGuestToSession(userId, req.params.id);

      // Send updated session to host
      const session = await getSession(req.params.id);
      send(
        WebSocketSubType.SESSION_DATA,
        session.participants.host,
        JSON.stringify(session)
      );

      res.send(session);
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
