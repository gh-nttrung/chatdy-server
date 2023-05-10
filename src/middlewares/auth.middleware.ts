import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { AppRequest, AuthData } from "../interfaces/common.interface";
import { authenticationError, serverError } from "../utils/respone.util";
import { publicPaths } from "../routes";

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
    const jwtSecretKey = process.env.JWT_SECRET_KEY as string;

    // Verify the token using the secret key
    jwt.verify(token, jwtSecretKey, (err, decoded) => {
      if (err) {
        return authenticationError(res, "Authorization failed");
      }

      // Attach the decoded user object to the request object
      const authData = decoded as AuthData;
      req.authData = authData;

      next();
    });
  } catch {
    return serverError(res, "Internal server error");
  }
};

export default authMiddleware;
