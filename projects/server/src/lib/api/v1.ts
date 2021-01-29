import { Router } from "express";
import { rooms } from "./rooms";

export const v1 = (): Router => {
  const router = Router();

  router.get("/", (req, res) => {
    res.send("Midishare API");
  });

  router.use("/rooms", rooms());

  return router;
};
