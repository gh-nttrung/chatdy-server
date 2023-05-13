import express from "express";
import { handlVerifyToken, handleLogin } from "../controllers/auth.controller";

const router = express.Router();

// Routes
router.post("/auth/login", handleLogin);
router.post("/auth/verify_token", handlVerifyToken);

export default router;
