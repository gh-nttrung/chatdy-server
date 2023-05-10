import { Response } from "express";
import { serverError } from "../utils/respone.util";
import { AppRequest } from "../common/commonModel";

export interface ChatInput {
  participants: string[];
  title: string;
}

// create chat function
export const createChat = async (req: AppRequest, res: Response) => {
  try {
    //TODO...
  } catch{
    return serverError(res, "Internal server error")
  }
};
