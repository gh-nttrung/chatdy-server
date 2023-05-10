import { Response } from "express";
import { Error, ErrorDetail, ResBody } from "../common/commonModel";

export const succeed = (res: Response, message?: string, data?: any) => {
  const resBody: ResBody = {
    success: true,
    message: message || "Success",
    data: data,
  };
  return res.status(200).json(resBody);
};

export const fail = (
  res: Response,
  statusCode: number,
  message?: string,
  error?: Error | null
) => {
  const resBody: ResBody = {
    success: false,
    message: message || "Error",
    error: error,
  };
  return res.status(statusCode).json(resBody);
};

export const badRequest = (
  res: Response,
  message?: string,
  error?: Error
) => {
  return fail(res, 400, message, error);
};

export const validationError = (
  res: Response,
  message?: string,
  errorDetails?: ErrorDetail[]
) => {
  const error: Error = {
    error_message: "Validation Error",
    code: "VALIDATION_ERROR",
    details: errorDetails || null,
  };
  return fail(res, 422, message, error);
};

export const authenticationError = (
  res: Response,
  message?: string,
  error?: Error
) => {
  return fail(res, 401, message, error);
};

export const serverError = (res: Response, message?: string) => {
  return fail(res, 500, message);
};

export const notFound = (res: Response, message?: string) => {
  return fail(res, 404, message);
};
