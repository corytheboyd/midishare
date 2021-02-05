import { Router } from "express";
import { sessions } from "./sessions";
import { profiles } from "./profiles";
import { addAnonymousIdCookie } from "../../addAnonymousIdCookie";

export const api = (): Router => {
  const router = Router();

  router.use(addAnonymousIdCookie());
  router.use("/sessions", sessions());
  router.use("/profiles", profiles());

  return router;
};
