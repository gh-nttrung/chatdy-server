import express from "express";
import {
  handleCreateChat,
  handleDeleteChat,
  handleGetAllChats,
  handleGetChatById,
  handleUpdateChat,
} from "../controllers/chat.controller";

const router = express.Router();

// Routes
router.post("/chat/create", handleCreateChat);
router.get("/chat/get_all", handleGetAllChats);
router.get("/chat/get_by_id/:id", handleGetChatById);
router.post("/chat/update/:id", handleUpdateChat);
router.post("/chat/delete/:id", handleDeleteChat);

export default router;
