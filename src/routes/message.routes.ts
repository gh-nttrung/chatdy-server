import express from "express";
import {
  handleCreateMessage,
  handleDeleteMessage,
  handleGetAllMessages,
  handleGetMessageById,
  // handleUpdateMessage,
  handleGetMessageList,
} from "../controllers/message.controller";
import MessageModel from "../models/message.model";
import { fail, succeed } from "../utils/respone.util";

const router = express.Router();

// Routes
router.post("/message/create", handleCreateMessage);
router.get("/message/get_all", handleGetAllMessages);
router.get("/message/get_by_id/:id", handleGetMessageById);
// router.post("/message/update/:id", handleUpdateMessage);
router.post("/message/delete/:id", handleDeleteMessage);
router.get("/message/get_message_list/:chat_id", handleGetMessageList);

router.post("/message/deleteAll", async (req, res) => {
  try {
    const result = await MessageModel.deleteMany();
    return succeed(res, undefined, result);
  } catch (error) {
    return fail(res, 500, "error");
  }
});

export default router;
