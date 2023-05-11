import mongoose from "mongoose";
import MessageModel, { Message } from "../models/message.model";

export async function insertMessage(message: Message): Promise<Message> {
  try {
    const newMessage = new MessageModel(message);
    const res = await newMessage.save();
    return res;
  } catch (error) {
    throw error;
  }
}

export async function getManyMessage(): Promise<Message[]> {
  try {
    const messages = await MessageModel.find();
    return messages;
  } catch (error) {
    throw error;
  }
}

export async function getMessageById(chat_id: string): Promise<Message | null> {
  try {
    if (mongoose.Types.ObjectId.isValid(chat_id)) {
      const message = await MessageModel.findById(chat_id);
      return message;
    }
    return null;
  } catch (error) {
    throw error;
  }
}

export async function getMessagesByChat(chat_id: string): Promise<Message[] | null> {
  try {
    const message = await MessageModel.find({
      chat_id: chat_id,
    });
    return message;
  } catch (error) {
    throw error;
  }
}

export async function getMessagesByChatAndUser(chat_id: string, user_id: string): Promise<Message[] | null> {
    try {
      const message = await MessageModel.find({
        chat_id: chat_id,
        sender_id: user_id
      });
      return message;
    } catch (error) {
      throw error;
    }
  }

export async function updateMessage(
  message_id: string,
  message: Message
): Promise<Message | null> {
  try {
    if (mongoose.Types.ObjectId.isValid(message_id)) {
      const updatedMessage = await MessageModel.findByIdAndUpdate(
        message_id,
        message
      );
      return updatedMessage;
    }
    return null;
  } catch (error) {
    throw error;
  }
}

export async function deleteMessage(message_id: string): Promise<Message | null> {
  try {
    if (mongoose.Types.ObjectId.isValid(message_id)) {
      const deletedMessage = await MessageModel.findByIdAndDelete(message_id);
      return deletedMessage;
    }
    return null;
  } catch (error) {
    throw error;
  }
}
