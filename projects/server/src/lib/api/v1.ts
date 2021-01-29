import { Router } from "express";
import { rooms } from "./rooms";

export const v1 = (): Router => {
  const router = Router();

  router.use("/rooms", rooms());

  return router;
};
