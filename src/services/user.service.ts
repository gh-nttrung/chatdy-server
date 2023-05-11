import bcrypt from "bcrypt";
import { User, UserModel } from "../models/user.model";
import mongoose from "mongoose";

export async function createUser(user: User): Promise<User> {
  try {
    const hashedPassword = await hashPassword(user.password);
    const newUser = new UserModel({ ...user, password: hashedPassword });
    const res = await newUser.save();
    return res;
  } catch (error) {
    throw error;
  }
}

export async function getManyUser(): Promise<User[]> {
  try {
    const users = await UserModel.find();
    return users;
  } catch (error) {
    throw error;
  }
}

export async function getUserById(user_id: string): Promise<User | null> {
  try {
    if (mongoose.Types.ObjectId.isValid(user_id)) {
      const user = await UserModel.findById(user_id);
      return user;
    }
    return null;
  } catch (error) {
    throw error;
  }
}

export async function getUserByUserName(
  userName: string
): Promise<User | null> {
  try {
    console.log(userName);
    const user = await UserModel.findOne({ user_name: userName });
    return user;
  } catch (error) {
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await UserModel.findOne({ email: email });
    return user;
  } catch (error) {
    throw error;
  }
}

export async function updateUser(
  user_id: string,
  user: User
): Promise<User | null> {
  try {
    if (mongoose.Types.ObjectId.isValid(user_id)) {
      const updatedUser = await UserModel.findByIdAndUpdate(user_id, user);
      return updatedUser;
    }
    return null;
  } catch (error) {
    throw error;
  }
}

export async function deleteUser(user_id: string): Promise<User | null> {
  try {
    if (mongoose.Types.ObjectId.isValid(user_id)) {
      const deletedUser = await UserModel.findByIdAndDelete(user_id);
      return deletedUser;
    }
    return null;
  } catch (error) {
    throw error;
  }
}

export async function hashPassword(password: string): Promise<string> {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  } catch (error) {
    throw error;
  }
}
