import { Schema, model, Types } from "mongoose";

export interface Chat {
  _id: string;
  title: string;
  participants: string[];
  created_user_id: string;
  created_at: Date;
  updated_at: Date;
}

const ChatSchema = new Schema({
  participants: [{ type: Types.ObjectId, ref: "User" }],
  created_user_id: { type: Types.ObjectId, ref: "User", required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const ChatModel = model<Chat>("Chat", ChatSchema);

export default ChatModel;
