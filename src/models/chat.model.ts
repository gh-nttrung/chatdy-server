import { Schema, model, Types } from "mongoose";

export interface Chat {
  _id?: string;
  title?: string;
  participants?: string[];
  last_message?: string;
  created_user_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ChatListItem {
  id?: string;
  title?: string;
  last_message?: string;
  last_active_time?: string;
  is_active?: boolean;
  unread?: number;
}

const ChatSchema = new Schema({
  title: { type: String },
  participants: [{ type: Types.ObjectId, ref: "User" }],
  last_message: { type: String },
  created_user_id: { type: Types.ObjectId, ref: "User", required: true },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
});

const ChatModel = model<Chat>("Chat", ChatSchema);

export default ChatModel;
