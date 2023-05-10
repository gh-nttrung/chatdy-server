import { Schema, model } from "mongoose";

export interface User{
  _id: string;
  user_name: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  status: "unconfimred" | "active" | "inactive";
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema({
  user_name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  profile_picture: { type: String },
  status: {
    type: String,
    enum: ["unconfimred", "active", "inactive"],
    default: "unconfimred",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const UserModel = model<User>("User", UserSchema);

export { UserModel };
