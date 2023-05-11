import express from "express";
import { login } from "../controllers/auth.controller";

const router = express.Router();

// Routes
router.post("/auth/login", login);

export default router;
