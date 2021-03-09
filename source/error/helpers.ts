export {};
import { Response } from "express";

class ErrorHandler extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleResponse = async (
  res: Response,
  status: string,
  code: number,
  message: string
): Promise<Response> => {
  return res.status(code).json({
    status,
    message,
  });
};

const handleError = async (
  err: { statusCode: number; message: string },
  res: Response
): Promise<Response> => {
  const { statusCode, message } = err;
  return res.status(statusCode).json({
    status: "error",
    message,
  });
};

export { handleResponse, ErrorHandler, handleError };
