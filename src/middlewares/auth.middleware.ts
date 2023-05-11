import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { AppRequest, AuthData } from "../common/commonModel";
import { authenticationError, serverError } from "../utils/respone.util";
import { UserModel } from "../models/user.model";

const publicPaths: string[] = ["/api", "/api/auth/login", "/api/user/create"];

const authMiddleware = (req: AppRequest, res: Response, next: NextFunction) => {
  try {
    // Skip authentication middleware for public paths
    if (publicPaths.includes(req.path)) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return authenticationError(res, "Authorization failed");
    }

    const token = authHeader.split(" ")[1];
    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    // Verify the token using the secret key
    jwt.verify(token, `${jwtSecretKey}`, async (err, decoded) => {
      if (err) {
        return authenticationError(res, "Authorization failed");
      }

      // Attach the decoded user object to the request object
      const authData = decoded as AuthData;

      const user = await UserModel.findOne({user_name: authData.user_name});
      if (!user) {
        return authenticationError(res, "Authorization failed");
      }

      req.authData = authData;
      next();
    });
  } catch {
    return serverError(res, "A system error has occurred");
  }
};

export default authMiddleware;
