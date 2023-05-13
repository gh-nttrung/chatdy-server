import { Response } from "express";
import bcrypt from "bcrypt";

import { badRequest, serverError, succeed } from "../utils/respone.util";
import { User, UserModel } from "../models/user.model";
import { AppRequest } from "../common/commonModel";
import { Types } from "mongoose";
import ChatModel from "../models/chat.model";

// function hash password
async function hashPassword(password: string): Promise<string> {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  } catch (error) {
    throw error;
  }
}

// handle register function
export const handleCreateUser = async (req: AppRequest, res: Response) => {
  try {
    const user: User = req.body;

    //Validate
    //

    const userExist = await UserModel.findOne({
      $or: [{ user_name: user.user_name }, { email: user.email }],
    });

    if (userExist) {
      return badRequest(res, "User already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(`${user.password}`);

    // Save user document
    const newUser = new UserModel({ ...user, password: hashedPassword });
    const result = await newUser.save();

    if (result) {
      // Return the user and access token in the response
      return succeed(res, "User created successfully");
    }

    return badRequest(res, "Created failure");
  } catch {
    return serverError(res, "A system error has occurred");
  }
};

// handle get user by id
export const handleGetUserById = async (req: AppRequest, res: Response) => {
  try {
    const user_id = req.params.id;

    if (Types.ObjectId.isValid(user_id)) {
      const user = await UserModel.findById(user_id);
      
      if (!user) {
        return badRequest(res, "Couldn't find any user");
      }
  
      // Return the users
      return succeed(res, undefined, user);
    }

    return badRequest(res, "Couldn't find any user");
  } catch {
    return serverError(res, "A system error has occurred");
  }
};

// handle get all users
export const handleGetAllUsers = async (req: AppRequest, res: Response) => {
  try {
    const users = await UserModel.find();

    if (!users || users.length == 0) {
      return badRequest(res, "Couldn't find any user");
    }

    // Return the users
    return succeed(res, undefined, users);
  } catch {
    return serverError(res, "A system error has occurred");
  }
};

// handle get user by user_name
export const handleGetUserByUsername = async (
  req: AppRequest,
  res: Response
) => {
  try {
    const user_name = req.params.user_name;

    const user = await UserModel.findOne({user_name: user_name});
    
    if (!user) {
      return badRequest(res, "Couldn't find any user");
    }

    // Return the users
    return succeed(res, undefined, user);
  } catch {
    return serverError(res, "A system error has occurred");
  }
};

// handle get users by email
export const handleGetUserByEmail = async (req: AppRequest, res: Response) => {
  try {
    const email = req.params.email;

    const user = await UserModel.findOne({email: email});
    
    if (!user) {
      return badRequest(res, "Couldn't find any user");
    }

    // Return the users
    return succeed(res, undefined, user);
  } catch {
    return serverError(res, "A system error has occurred");
  }
};

// handle update user
export const handleUpdateUser = async (req: AppRequest, res: Response) => {
  try {
    const user_id = req.params.id;
    const user: User = req.body;

    //update password
    if(user.password && user.password !== ""){
      user.password = `${await hashPassword(user.password)}`;
    }
    //update date
    user.updated_at = new Date()

    if (Types.ObjectId.isValid(user_id)) {
      const updatedUser = await UserModel.findByIdAndUpdate(user_id, user);

      if (!updatedUser) {
        return badRequest(res, "Couldn't find any user");
      }

      // Return success result
      return succeed(res, `User ${user_id} has updated`, undefined);
    }
    return badRequest(res, "Updated failed");
  } catch {
    return serverError(res, "A system error has occurred");
  }
};

// handle delete user
export const handleDeleteUser = async (req: AppRequest, res: Response) => {
  try {
    const user_id = req.params.id;

    if (Types.ObjectId.isValid(user_id)) {
      const deletedUser = await UserModel.findByIdAndDelete(user_id);

      if (!deletedUser) {
        return badRequest(res, "Couldn't find any user");
      }

      // Return
      return succeed(res, `User ${user_id} has deleted`, undefined);
    }

    return badRequest(res, "Couldn't find any user");
  } catch {
    return serverError(res, "A system error has occurred");
  }
};
