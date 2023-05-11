import {Response} from "express";
import { AppRequest } from "../common/commonModel";
import MessageModel, { Message } from "../models/message.model";
import { authenticationError, badRequest, serverError, succeed } from "../utils/respone.util";
import { Types } from "mongoose";

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

// handle get messages of message