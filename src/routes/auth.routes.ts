import express from "express";
import { handleLogin } from "../controllers/auth.controller";

const router = express.Router();

// Routes
router.post("/auth/login", handleLogin);

export default router;
