import { Response } from "express";
import { AppRequest } from "../common/commonModel";
import MessageModel, { Message, MessageItem } from "../models/message.model";
import {
  authenticationError,
  badRequest,
  serverError,
  succeed,
} from "../utils/respone.util";
import { Types } from "mongoose";
import { UserModel } from "../models/user.model";

// create message function
export const handleCreateMessage = async (req: AppRequest, res: Response) => {
  try {
    const message: Message = req.body;
    const user_id = req.authData?.user_id;
    if (!user_id) {
      return authenticationError(res, "Authorization failed");
    }

    //Validate
    //

    // Set created user
    message.sender_id = user_id;

    // Save message document
    const newMessage = new MessageModel(message);
    const result = await newMessage.save();

    if (result) {
      return succeed(res, "Created successfully");
    }

    return badRequest(res, "Created failure");
  } catch {
    return serverError(res, "A system error has occurred");
  }
};

// handle get message by id
export const handleGetMessageById = async (req: AppRequest, res: Response) => {
  try {
    const message_id = req.params.id;
    if (Types.ObjectId.isValid(message_id)) {
      const message = await MessageModel.findById(message_id);

      if (!message) {
        return badRequest(res, "Couldn't find any message");
      }

      // Return the messages
      return succeed(res, undefined, message);
    }

    return badRequest(res, "Couldn't find any message");
  } catch {
    return serverError(res, "A system error has occurred");
  }
};

// handle get all messages
export const handleGetAllMessages = async (req: AppRequest, res: Response) => {
  try {
    const messages = await MessageModel.find();

    if (!messages || messages.length == 0) {
      return badRequest(res, "Couldn't find any message");
    }

    // Return the messages
    return succeed(res, undefined, messages);
  } catch {
    return serverError(res, "A system error has occurred");
  }
};

// // handle update message
// export const handleUpdateMessage = async (req: AppRequest, res: Response) => {
//   try {
//     const message_id = req.params.id;
//     const message: Message = req.body;

//     // Update date
//     message.updated_at = new Date();

//     if (Types.ObjectId.isValid(message_id)) {
//       const updatedMessage = await MessageModel.findByIdAndUpdate(message_id, message);

//       if (!updatedMessage) {
//         return badRequest(res, "Couldn't find any message");
//       }

//       // Return success result
//       return succeed(res, `Message ${message_id} has updated`, undefined);
//     }
//     return badRequest(res, "Updated failed");
//   } catch {
//     return serverError(res, "A system error has occurred");
//   }
// };

// handle delete message
export const handleDeleteMessage = async (req: AppRequest, res: Response) => {
  try {
    const message_id = req.params.id;

    if (Types.ObjectId.isValid(message_id)) {
      const deletedMessage = await MessageModel.findByIdAndDelete(message_id);

      if (!deletedMessage) {
        return badRequest(res, "Couldn't find any message");
      }

      // Return the messages
      return succeed(res, `Message ${message_id} has deleted`, undefined);
    }

    return badRequest(res, "Couldn't find any message");
  } catch {
    return serverError(res, "A system error has occurred");
  }
};

// handleGetMessageList
export const handleGetMessageList = async (req: AppRequest, res: Response) => {
  try {
    const chat_id = req.params.chat_id;

    var result: MessageItem[] = [];

    if (Types.ObjectId.isValid(chat_id)) {
      const messages = await MessageModel.find({ chat_id: chat_id });

      if (!messages) {
        return badRequest(res, "Couldn't find any message");
      }

      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];

        const sender = await UserModel.findById(message.sender_id);

        result.push({
          id: message._id,
          user_name: `${sender?.first_name} ${sender?.last_name}`,
          isMe: message.sender_id?.toString() === req.authData?.user_id,
          text: message.content,
          time: message.created_at?.toLocaleString(),
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
