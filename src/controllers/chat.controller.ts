import { Response } from "express";
import { badRequest, fail, serverError, succeed } from "../utils/respone.util";
import { AppRequest } from "../common/commonModel";
import {
  deleteChat,
  getChatById,
  getChats,
  getManyChat,
  insertChat,
} from "../services/chat.service";
import { Chat } from "../models/chat.model";

export interface ChatInput {
  participants: string[];
  title: string;
}

// create chat function
export const createChat = async (req: AppRequest, res: Response) => {
  try {
    const reqBody: ChatInput = req.body;
    const user_id = req.authData?.user_id;

    //Validate
    //

    // Check if chat already exists
    const chatsExist = await getChats(reqBody.participants);
    if (chatsExist && chatsExist.length > 0) {
      return badRequest(res, "Chat existed");
    }

    if (!user_id) {
      return badRequest(res, "Bad request");
    }

    const chat = {
      title: "",
      participants: reqBody.participants,
      created_user_id: user_id,
    } as Chat;

    // Save chat document
    var newChat = await insertChat(chat);

    if (newChat) {
      // Return the chat and access token in the response
      return succeed(res, "Chat created successfully");
    } else {
      return fail(res, 503, "Service Unavailable");
    }
  } catch {
    return serverError(res, "Internal server error");
  }
};

// handle get chat by id
export const handleGetChatById = async (req: AppRequest, res: Response) => {
  try {
    const chat_id = req.params.id;

    const chat = await getChatById(chat_id);

    if (!chat) {
      return badRequest(res, "Couldn't find any chat");
    }

    // Return the chats
    return succeed(res, undefined, chat);
  } catch {
    return serverError(res, "Internal server error");
  }
};

// handle get all chats
export const handleGetChats = async (req: AppRequest, res: Response) => {
  try {
    const chats = await getManyChat();

    if (!chats || chats.length == 0) {
      return badRequest(res, "Couldn't find any chat");
    }

    // Return the chats
    return succeed(res, undefined, chats);
  } catch {
    return serverError(res, "Internal server error");
  }
};

// handle update chat
export const handleUpdateChat = async (req: AppRequest, res: Response) => {
  try {

    const chat_id = req.params.id;
    const chat = await deleteChat(chat_id);

    if (!chat) {
      return badRequest(res, "Couldn't find any chat");
    }

    // Return the chats
    return succeed(res, `chat ${chat_id} has deleted`, undefined);
  } catch {
    return serverError(res, "Internal server error");
  }
};

// handle delete chat
export const handleDeleteChat = async (req: AppRequest, res: Response) => {
  try {

    const chat_id = req.params.id;
    const chat = await deleteChat(chat_id);

    if (!chat) {
      return badRequest(res, "Couldn't find any chat");
    }

    // Return the chats
    return succeed(res, `chat ${chat_id} has deleted`, undefined);
  } catch {
    return serverError(res, "Internal server error");
  }
};

// // handle get users by user name
// export const handleGetUserByUsername = async (
//   req: AppRequest,
//   res: Response
// ) => {
//   try {
//     const userName = req.query.user_name;
//     const user = await getUserByUserName(`${userName}`);

//     if (!user) {
//       return badRequest(res, "Couldn't find any user");
//     }

//     // Return the users
//     return succeed(res, undefined, user);
//   } catch {
//     return serverError(res, "Internal server error");
//   }
// };

// // handle get users by user name
// export const handleGetUserByEmail = async (req: AppRequest, res: Response) => {
//   try {
//     const email = req.query.email;
//     const user = await getUserByEmail(`${email}`);

//     if (!user) {
//       return badRequest(res, "Couldn't find any user");
//     }

//     // Return the users
//     return succeed(res, undefined, user);
//   } catch {
//     return serverError(res, "Internal server error");
//   }
// };
