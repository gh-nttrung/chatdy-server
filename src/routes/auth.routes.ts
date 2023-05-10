import express from "express";
import { login } from "../controllers/auth.controller";
import { loginRules } from "../validations/auth.validation";

const router = express.Router();

// Routes
router.post("/api/auth/login", loginRules, login);

export default router;
