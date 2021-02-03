import { Router } from "express";
import { sessions } from "./sessions";
import { profiles } from "./profiles";

export const api = (): Router => {
  const router = Router();

  router.use("/sessions", sessions());
  router.use("/profiles", profiles());

  return router;
};
