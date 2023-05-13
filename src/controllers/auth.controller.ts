import { Response } from "express";
import jwt, { verify } from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  authenticationError,
  badRequest,
  serverError,
  succeed,
} from "../utils/respone.util";
import { AppRequest, AuthData } from "../common/commonModel";
import { UserModel } from "../models/user.model";

// handle login
export const handleLogin = async (req: AppRequest, res: Response) => {
  try {
    const reqBody: { user_name: string; password: string } = req.body;

    // Validation
    // ...

    // Find the user with the provided email address or user name
    const user = await UserModel.findOne({ user_name: reqBody.user_name });

    // If the user is not found, return an error
    if (!user) {
      return authenticationError(res, "Invalid authentication credentials");
    }

    // Check if the provided password matches the user's stored password
    const isMatching = comparePasswords(reqBody.password, `${user.password}`);

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
    });
  } catch {
    return serverError(res, "A system error has occurred");
  }
};

// handle verifytoken
export const handlVerifyToken = async (req: AppRequest, res: Response) => {
  try {
    const reqBody: { token: string } = req.body;

    // Validation
    // ...

    //
    jwt.verify(
      reqBody.token,
      `${process.env.JWT_SECRET_KEY}`,
      async (err, decoded) => {
        if (err) {
          return authenticationError(res, "Authorization failed");
        }

        // Attach the decoded user object to the request object
        const authData = decoded as AuthData;

        const user = await UserModel.findOne({ user_name: authData.user_name });
        if (!user) {
          return authenticationError(res, "Authorization failed");
        }
        return succeed(res, undefined, {
          ...authData,
          first_name: user.first_name,
          last_name: user.last_name,
        });
      }
    );
  } catch {
    return serverError(res, "A system error has occurred");
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
