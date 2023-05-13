import express from "express";
import {
  handleCreateChat,
  handleDeleteChat,
  handleGetAllChats,
  handleGetChatById,
  handleSearchListChats,
  handleUpdateChat,
  handleGetChatList,
  handleGetChatDetailByUserNamePartnert,
} from "../controllers/chat.controller";
import ChatModel from "../models/chat.model";
import { fail, succeed } from "../utils/respone.util";

const router = express.Router();

// Routes
router.post("/chat/create", handleCreateChat);
router.get("/chat/get_all", handleGetAllChats);
router.get("/chat/get_by_id/:id", handleGetChatById);
router.post("/chat/update/:id", handleUpdateChat);
router.post("/chat/delete/:id", handleDeleteChat);
router.get("/chat/:user_id/search", handleSearchListChats);
router.get("/chat/get_chat_list/:user_id", handleGetChatList);

//Trường hợp chat 1-1 (chưa xét trường hợp chat nhiều memmber tại thời điểm hiện tại 13.05.2023) 
router.get("/chat/get_chat_detail/:user_name_partnert", handleGetChatDetailByUserNamePartnert);

// router.post("/chat/deleteAll", async (req, res) => {
//   try {
//     const result = await ChatModel.deleteMany();
//     return succeed(res, undefined, result);
//   } catch (error) {
//     return fail(res, 500, "error");
//   }
// });


export default router;
