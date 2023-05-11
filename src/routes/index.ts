import express, { Response } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import chatRoutes from "./chat.routes";
import messageRoutes from "./message.routes";
import { succeed } from "../utils/respone.util";

const router = express.Router();

router.get("/api", (_, res: Response) => {
  return succeed(res, "Hello World!");
});

router.use("/api", authRoutes);
router.use("/api", userRoutes);
router.use("/api", chatRoutes);
router.use("/api", messageRoutes);

export default router;
