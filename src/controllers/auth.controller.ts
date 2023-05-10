import { Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { getUserByUserName } from "../services/user.service";
import {
  authenticationError,
  serverError,
  succeed,
  validationError,
} from "../utils/respone.util";
import {
  AppRequest,
  AuthData,
  ErrorDetail,
} from "../interfaces/common.interface";

export interface LoginInput {
  user_name: string;
  password: string;
}

export interface LoginOutput {
  token: string;
}

// login function
export const login = async (req: AppRequest, res: Response) => {
  try {
    const reqBody: LoginInput = req.body;

    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var erorrDetails: ErrorDetail[] = [];
      errors.array().map((error) => {
        erorrDetails.push({ param: error.param, message: error.msg });
      });
      return validationError(res, "Invalid input", erorrDetails);
    }

    // Find the user with the provided email address or user name
    const user = await getUserByUserName(reqBody.user_name);

    // If the user is not found, return an error
    if (!user) {
      return authenticationError(res, "Invalid authentication credentials");
    }

    // Check if the provided password matches the user's stored password
    const isMatching = comparePasswords(reqBody.password, user.password);

    // If the password is incorrect, return an error
    if (!isMatching) {
      return authenticationError(res, "Invalid authentication credentials");
    }

    // Generate a JWT token for the authenticated user
    const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
    const payload = {
      user_id: user._id,
      user_name: user.user_name,
    } as AuthData;
    const token = jwt.sign(payload, jwtSecretKey);

    // Return the user and access token in the response
    return succeed(res, "Logged in successfully", {
      token: token,
    } as LoginOutput);
  } catch {
    return serverError(res, "Internal server error");
  }
};

async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw error;
  }
}
