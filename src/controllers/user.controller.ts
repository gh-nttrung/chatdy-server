import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import {
  createUser,
  getManyUser,
  getUserByEmail,
  getUserById,
  getUserByUserName,
} from "../services/user.service";
import { badRequest, fail, serverError, succeed } from "../utils/respone.util";
import { User } from "../models/user.model";
import { AppRequest } from "../common/commonModel";

export interface UserInput {
  user_name: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

// handle register function
export const handleRegisterUser = async (req: AppRequest, res: Response) => {
  try {
    const reqBody: UserInput = req.body;

    //Validate
    //

    // Check if user already exists
    const usernameExist = await getUserByUserName(reqBody.user_name);
    const emailExist = await getUserByEmail(reqBody.email);
    if (usernameExist || emailExist) {
      return badRequest(res, "Email or username already used");
    }

    const user = {
      user_name: reqBody.user_name,
      password: reqBody.password,
      email: reqBody.email,
      first_name: reqBody.first_name,
      last_name: reqBody.last_name,
      profile_picture: reqBody.profile_picture,
    } as User;

    // Save user document
    var newUser = await createUser(user);

    if (newUser) {
      // Return the user and access token in the response
      return succeed(res, "User created successfully");
    } else {
      return fail(res, 503, "Service Unavailable");
    }
  } catch {
    return serverError(res, "Internal server error");
  }
};

// handle get user by id
export const handleGetUserById = async (req: AppRequest, res: Response) => {
  try {
    const user_id = req.params.id;

    const user = await getUserById(user_id);

    if (!user) {
      return badRequest(res, "Couldn't find any user");
    }

    // Return the users
    return succeed(res, undefined, user);
  } catch {
    return serverError(res, "Internal server error");
  }
};

// handle get all users
export const handleGetUsers = async (req: AppRequest, res: Response) => {
  try {
    const users = await getManyUser();

    if (!users || users.length == 0) {
      return badRequest(res, "Couldn't find any user");
    }

    // Return the users
    return succeed(res, undefined, users);
  } catch {
    return serverError(res, "Internal server error");
  }
};

// handle get users by user name
export const handleGetUserByUsername = async (
  req: Request,
  res: Response
) => {
  try {
    const userName = req.params.user_name;
    console.log(userName);

    const user = await getUserByUserName(userName);
    console.log(user); 
    if (!user) {
      return badRequest(res, "Couldn't find any user");
    }

    // Return the users
    return succeed(res, undefined, user);
  } catch {
    return serverError(res, "Internal server error");
  }
};

// handle get users by user name
export const handleGetUserByEmail = async (req: AppRequest, res: Response) => {
  try {
    const userName = req.params.user_name;
    const user = await getUserByUserName(userName);

    if (!user) {
      return badRequest(res, "Couldn't find any user");
    }

    // Return the users
    return succeed(res, undefined, user);
  } catch {
    return serverError(res, "Internal server error");
  }
};
