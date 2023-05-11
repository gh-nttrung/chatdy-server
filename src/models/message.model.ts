import { Schema, model, Types } from "mongoose";

export interface Message{
  _id?: string;
  chat_id?: string;
  sender_id?: string;
  content?: string;
  created_at?: Date;
  updated_at?: Date;
}

const MessageSchema = new Schema({
  chat_id: { type: Types.ObjectId, ref: "User", required: true },
  sender_id: { type: Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const MessageModel = model<Message>("Message", MessageSchema);

export default MessageModel;
