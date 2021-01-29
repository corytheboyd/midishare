import { Router } from "express";
import { rooms } from "./rooms";
import { profiles } from "./profiles";

export const api = (): Router => {
  const router = Router();

  router.use("/rooms", rooms());
  router.use("/profiles", profiles());

  return router;
};
