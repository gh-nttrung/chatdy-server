import { Request } from "express";

export interface ResBody {
  success: boolean;
  data?: any;
  message?: string | null;
  error?: Error | null;
}

export interface Error {
  error_message: string | null;
  code: string | null;
  details: ErrorDetail[] | null;
}

export interface ErrorDetail {
  message: string;
  param: string;
}

export interface AuthData {
  user_id: string;
  user_name: string;
}

export interface AppRequest extends Request {
  authData?: AuthData
}
