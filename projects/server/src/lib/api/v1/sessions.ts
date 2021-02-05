import { Router } from "express";
import { requiresAuth } from "express-openid-connect";
import { fromRequest } from "../../getOpenIdContext";
import { getSession } from "../../state/getSession";
import { getCurrentUserId } from "../../getCurrentUserId";
import { addGuestToSession } from "../../state/addGuestToSession";
import { createSession } from "../../state/createSession";

export const sessions = (): Router => {
  const router = Router();

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

    const session = await createSession({
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
      let session = await getSession(req.params.id);

      if (!session) {
        res.status(404);
        res.end();
        return;
      }

      const userId = getCurrentUserId(req);
      addGuestToSession(session.id, userId);

      // Re-fetch after update
      session = await getSession(req.params.id);

      res.send(session);
    }
  );

  return router;
};
