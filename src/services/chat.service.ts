import mongoose, { ObjectId } from "mongoose";
import ChatModel, { Chat } from "../models/chat.model";
import { ChatInput } from "../controllers/chat.controller";

export async function insertChat(chat: Chat): Promise<Chat> {
  try {
    console.log(chat)
    const newChat = new ChatModel(chat);
    console.log(newChat)
    const res = await newChat.save();
    console.log(2)
    
    return res;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export async function getManyChat(): Promise<Chat[]> {
  try {
    const chats = await ChatModel.find();
    return chats;
  } catch (error) {
    throw error;
  }
}

export async function getChatById(chat_id: string): Promise<Chat | null> {
  try {
    if (mongoose.Types.ObjectId.isValid(chat_id)) {
      const chat = await ChatModel.findById(chat_id);
      return chat;
    }
    return null;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export async function getChats(participants: string[]): Promise<Chat[] | null> {
  try {
    const chats = await ChatModel.find({participants: { $all: participants }});
    return chats;
  } catch (error) {
    throw error;
  }
}

export async function getChatsbyUserId(
  user_id: string
): Promise<Chat[] | null> {
  try {
    const user = await ChatModel.find({ participants: user_id });
    return user;
  } catch (error) {
    throw error;
  }
}

export async function updateChat(
  chat_id: string,
  chat: Chat
): Promise<Chat | null> {
  try {
    if (mongoose.Types.ObjectId.isValid(chat_id)) {
      const updatedChat = await ChatModel.findByIdAndUpdate(chat_id, chat);
      return updatedChat;
    }
    return null;
  } catch (error) {
    throw error;
  }
}

export async function deleteChat(chat_id: string): Promise<Chat | null> {
  try {
    console.log(chat_id)
    if (mongoose.Types.ObjectId.isValid(chat_id)) {
      console.log(123)
      const deletedChat = await ChatModel.findByIdAndDelete(chat_id);
      return deletedChat;
    }
    return null;
  } catch (error) {
    throw error;
  }
}
