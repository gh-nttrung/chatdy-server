import { Response } from "express";
import {
  authenticationError,
  badRequest,
  serverError,
  succeed,
} from "../utils/respone.util";
import { AppRequest } from "../common/commonModel";
import ChatModel, { Chat, ChatListItem } from "../models/chat.model";
import { Types } from "mongoose";
import { UserModel } from "../models/user.model";
import MessageModel from "../models/message.model";

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

      // const lastMsg = await MessageModel.findOne({
      //   chat_id: chat._id,
      //   created_at: -1,
      // });
      // chat.last_message = lastMsg?.content;

      let title = "";
      if (chat.participants && chat.participants.length > 0) {
        for (let i = 0; i < chat.participants.length; i++) {
          const pid = chat.participants[i];
          const user = await UserModel.findById(pid);
          title = `${user?.last_name}, ` + title;
        }
      } else {
        title = `Chat ${chat._id}`;
      }

      // Return the chats
      return succeed(res, undefined, {
        id: chat_id,
        title: title.trim().slice(0, -1),
      } as ChatListItem);
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

    for (let i = 0; i < chats.length; i++) {
      const chat = chats[i];
      const lastMsg = await MessageModel.findOne({
        chat_id: chat._id,
        created_at: -1,
      });
      chat.last_message = lastMsg?.content;
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

// handle search list chat
export const handleSearchListChats = async (req: AppRequest, res: Response) => {
  try {
    const user_id = req.params.user_id;
    // const max_chat_count = req.params.max_chat_count;
    // const last = req.params.max_chat_count;

    if (Types.ObjectId.isValid(user_id)) {
      const chats = await ChatModel.find({ participants: user_id });

      if (!chats) {
        return badRequest(res, "Couldn't find any chat");
      }

      for (let i = 0; i < chats.length; i++) {
        const chat = chats[i];

        // Set title
        if (!chat.title || chat.title.trim() === "") {
          let title = "";
          if (chat.participants && chat.participants.length > 0) {
            for (let i = 0; i < chat.participants.length; i++) {
              const pid = chat.participants[i];
              const user = await UserModel.findById(pid);
              title = `${user?.last_name}, ` + title;
            }
          } else {
            title = `Chat ${chat._id}`;
          }
          chat.title = title;
        }

        // Set last message
        const lastMessage = await MessageModel.findOne({
          chat_id: chat._id,
          created_at: 1,
        });

        chat.last_message = lastMessage?.content;
      }

      // Return chats
      return succeed(res, undefined, chats);
    }

    return badRequest(res, "Couldn't find any chat");
  } catch {
    return serverError(res, "A system error has occurred");
  }
};

export const handleGetChatList = async (req: AppRequest, res: Response) => {
  try {
    const user_id = req.params.user_id;

    var result: ChatListItem[] = [];

    if (Types.ObjectId.isValid(user_id)) {
      const chats = await ChatModel.find({ participants: user_id });

      if (!chats) {
        return badRequest(res, "Couldn't find any chat");
      }

      for (let i = 0; i < chats.length; i++) {
        const chat = chats[i];

        // Set title
        if (!chat.title || chat.title.trim() === "") {
          let title = "";
          if (chat.participants && chat.participants.length > 0) {
            for (let i = 0; i < chat.participants.length; i++) {
              const pid = chat.participants[i];
              const user = await UserModel.findById(pid);
              title = `${user?.last_name}, ` + title;
            }
          } else {
            title = `Chat ${chat._id}`;
          }
          chat.title = title.trim().slice(0, -1);
        }

        // Set last message
        const lastMessage = await MessageModel.findOne({
          chat_id: chat._id,
          created_at: 1,
        });

        chat.last_message = lastMessage?.content;

        result.push({
          id: chat._id,
          title: chat.title,
          is_active: false,
          last_message: lastMessage?.content,
          last_active_time: lastMessage?.created_at
            ?.getUTCDate()
            .toLocaleString(),
        });
      }

      // Return chats
      return succeed(res, undefined, result);
    }

    return badRequest(res, "Couldn't find any chat");
  } catch {
    return serverError(res, "A system error has occurred");
  }
};

// Dùng cho trường hợp chat 1-1
export const handleGetChatDetailByUserNamePartnert = async (
  req: AppRequest,
  res: Response
) => {
  try {
    const user_name = req.params.user_name_partnert;
    const my_id = `${req.authData?.user_id}`;

    const partner = await UserModel.findOne({ user_name: user_name });

    if (partner) {
      const chat = await ChatModel.findOne({
        participants: [partner?._id, my_id],
      });

      if (chat && chat.participants) {
        let title = "";
        for (let i = 0; i < chat.participants.length; i++) {
          const pid = chat.participants[i];
          const user = await UserModel.findById(pid);
          title = `${user?.last_name}, ` + title;
        }

        return succeed(res, undefined, {
          id: chat._id,
          title: title.trim().slice(0, -1),
          is_active: false,
          last_message: "",
          last_active_time: "",
        } as ChatListItem);
      } else {
        const newChat = new ChatModel({
          participants: [my_id, partner.id ],
          created_user_id: req.authData?.user_id,
          created_at: new Date(),
          updated_at: new Date(),
        });

        const result = await newChat.save();

        if (result && result.participants) {
          let title = "";
          for (let i = 0; i < result.participants.length; i++) {
            const pid = result.participants[i];
            const user = await UserModel.findById(pid);
            title = `${user?.last_name}, ` + title;
          }
          // Return chat
          return succeed(res, undefined, {
            id: result._id,
            title: title.trim().slice(0, -1),
            is_active: false,
            last_message: "",
            last_active_time: "",
          } as ChatListItem);
        }
      }

      return badRequest(res, "Bad request");
    }

    return badRequest(res, "Bad request");
  } catch (err) {
    console.log(err)
    return serverError(res, "A system error has occurred");
  }
};
