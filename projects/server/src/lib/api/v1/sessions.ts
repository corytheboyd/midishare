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
import { setSustainInverted } from "../../state/setSustainInverted";

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

  router.post("/:id/setSustainInverted", requiresAuth(), async (req, res) => {
    const userId = getCurrentUserId(req);
    const session = await getSession(req.params.id);

    if (
      session.participants.host !== userId ||
      session.participants.guest !== userId
    ) {
      res.status(404);
      res.end();
      return;
    }

    const value = req.params.value === "1";

    if (session.participants.host === userId) {
      await setSustainInverted(session.id, "host", value);
    } else {
      await setSustainInverted(session.id, "guest", value);
    }

    // Send updated session to other peer
    await (async () => {
      const session = await getSession(req.params.id);

      const targetUser =
        userId === session.participants.host
          ? session.participants.guest
          : session.participants.host;

      // Guest may not have joined yet
      if (!targetUser) {
        return;
      }

      // Send updated session to other peer
      send(WebSocketSubType.SESSION_DATA, targetUser, JSON.stringify(session));

      // Send updated session back in response
      res.send(session);
    })();
  });

  return router;
};
