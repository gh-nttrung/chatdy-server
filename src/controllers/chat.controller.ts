import { Response } from "express";
import {
  authenticationError,
  badRequest,
  serverError,
  succeed,
} from "../utils/respone.util";
import { AppRequest } from "../common/commonModel";
import ChatModel, { Chat } from "../models/chat.model";
import { Types } from "mongoose";
import { UserModel } from "../models/user.model";

// create chat function
export const handleCreateChat = async (req: AppRequest, res: Response) => {
  try {
    const chat: Chat = req.body;

    //Validate
    //

    // get user_id to set for create_user
    const user_id = req.authData?.user_id;
    if (!user_id) {
      return authenticationError(res, "Authorization failed");
    }
    chat.created_user_id = user_id;

    // Check members
    if (chat.participants) {
      if (!chat.participants.includes(user_id)) {
        chat.participants.push(user_id);
      }

      if (chat.participants.length < 2) {
        return badRequest(res, "No receiver");
      }
    } else {
      return badRequest(res, "Bad request");
    }

    for (let i = 0; i < chat.participants.length; i++) {
      if (!Types.ObjectId.isValid(chat.participants[i])) {
        return badRequest(
          res,
          "There exists at least one incorrect participant"
        );
      } else {
        const result = UserModel.findById(chat.participants[i]);
        if (!result) {
          return badRequest(
            res,
            "There exists at least one incorrect participant"
          );
        }
      }
    }

    // Check if chat already exists
    const chatsExist = await ChatModel.find({
      participants: { $all: chat.participants },
    });

    if (chatsExist && chatsExist.length > 0) {
      return badRequest(res, "Chat already exists");
    }

    // Save chat document
    const newChat = new ChatModel(chat);
    const result = await newChat.save();

    if (result) {
      return succeed(res, "Created successfully");
    }

    return badRequest(res, "Created failure");
  } catch (err) {
    console.log(err);
    return serverError(res, "A system error has occurred");
  }
};

// handle get chat by id
export const handleGetChatById = async (req: AppRequest, res: Response) => {
  try {
    const chat_id = req.params.id;
    if (Types.ObjectId.isValid(chat_id)) {
      const chat = await ChatModel.findById(chat_id);

      if (!chat) {
        return badRequest(res, "Couldn't find any chat");
      }

      // Return the chats
      return succeed(res, undefined, chat);
    }

    return badRequest(res, "Couldn't find any chat");
  } catch {
    return serverError(res, "A system error has occurred");
  }
};

// handle get all chats
export const handleGetAllChats = async (req: AppRequest, res: Response) => {
  try {
    const chats = await ChatModel.find();

    if (!chats || chats.length == 0) {
      return badRequest(res, "Couldn't find any chat");
    }

    // Return the chats
    return succeed(res, undefined, chats);
  } catch {
    return serverError(res, "A system error has occurred");
  }
};

// handle update chat
export const handleUpdateChat = async (req: AppRequest, res: Response) => {
  try {
    const chat_id = req.params.id;
    const chat: Chat = req.body;

    // get user_id
    const user_id = req.authData?.user_id;
    if (!user_id) {
      return authenticationError(res, "Authorization failed");
    }

    // Check members
    if (chat.participants) {
      if (!chat.participants.includes(user_id)) {
        chat.participants.push(user_id);
      }

      if (chat.participants.length < 2) {
        return badRequest(res, "No receiver");
      }
    } else {
      return badRequest(res, "Bad request");
    }

    for (let i = 0; i < chat.participants.length; i++) {
      if (!Types.ObjectId.isValid(chat.participants[i])) {
        return badRequest(
          res,
          "There exists at least one incorrect participant"
        );
      } else {
        const result = UserModel.findById(chat.participants[i]);
        if (!result) {
          return badRequest(
            res,
            "There exists at least one incorrect participant"
          );
        }
      }
    }

    //Update date
    chat.updated_at = new Date();

    if (Types.ObjectId.isValid(chat_id)) {
      const updatedChat = await ChatModel.findByIdAndUpdate(chat_id, chat);

      if (!updatedChat) {
        return badRequest(res, "Couldn't find any chat");
      }

      // Return success result
      return succeed(res, `Chat ${chat_id} has updated`, undefined);
    }
    return badRequest(res, "Updated failed");
  } catch {
    return serverError(res, "A system error has occurred");
  }
};

// handle delete chat
export const handleDeleteChat = async (req: AppRequest, res: Response) => {
  try {
    const chat_id = req.params.id;

    if (Types.ObjectId.isValid(chat_id)) {
      const deletedChat = await ChatModel.findByIdAndDelete(chat_id);

      if (!deletedChat) {
        return badRequest(res, "Couldn't find any chat");
      }

      // Return the chats
      return succeed(res, `Chat ${chat_id} has deleted`, undefined);
    }

    return badRequest(res, "Couldn't find any chat");
  } catch {
    return serverError(res, "A system error has occurred");
  }
};

// handle get messages of chat
