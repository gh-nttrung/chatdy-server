import express, { Request, Response } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import { succeed } from "../utils/respone.util";

const router = express.Router();

router.get("/api", (_, res: Response) => {
  return succeed(res, "Hello World!");
});

router.use("/api", authRoutes);
router.use("/api", userRoutes);

export default router;

export const publicPaths: string[] = ["/", "/auth/login", "/user/register"];
