import { NextFunction, Request, Response } from 'express';
import { HttpError as MyHttpError } from 'http-errors';

export function errorHandler(err: MyHttpError, req: Request, res: Response, _next: NextFunction) {
  console.error('ERRO: ', err);
  const statusCode = err.statusCode || 500;
  const message = err.customMessage || err.message || 'Internal Server Error';
  const success = false;
  return res.status(statusCode).json({ success, message, statusCode });
}

export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
