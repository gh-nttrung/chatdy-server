import express from "express";
import { createChat, handleDeleteChat, handleGetChatById, handleGetChats } from "../controllers/chat.controller";

const router = express.Router();

// Routes
router.post("/chat/create", createChat);
router.get("/chat/get_all", handleGetChats);
router.get("/chat/get_by_id/:id", handleGetChatById);
router.post("/chat/update/:id", );
router.post("/chat/delete/:id", handleDeleteChat);


export default router;

