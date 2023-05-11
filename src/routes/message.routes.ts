import express from "express";
import {
  handleCreateMessage,
  handleDeleteMessage,
  handleGetAllMessages,
  handleGetMessageById,
  // handleUpdateMessage,
} from "../controllers/message.controller";

const router = express.Router();

// Routes
router.post("/message/create", handleCreateMessage);
router.get("/message/get_all", handleGetAllMessages);
router.get("/message/get_by_id/:id", handleGetMessageById);
// router.post("/message/update/:id", handleUpdateMessage);
router.post("/message/delete/:id", handleDeleteMessage);

export default router;
