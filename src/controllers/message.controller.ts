import express, { Request, Response } from "express";
import { AppRequest } from "../common/commonModel";
import { serverError } from "../utils/respone.util";

// send message function
export const sendMessage = async (req: AppRequest, res: Response) => {
  try {
    //TODO...
  } catch {
    return serverError(res, "Internal server error")
  }
};
