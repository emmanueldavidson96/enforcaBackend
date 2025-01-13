import { MongooseError } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

export const errHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): Response<unknown> => {
  let statusCode: number = res.statusCode === 200 ? 500 : res.statusCode;
  let message: string = 'A server error occurred';
  let type: string = 'Server Error';

  if (error instanceof Error) {
    message = error.message;
  }
  
  if (error instanceof MongooseError) {
    message = error.message;
    type = 'Mongoose or MongoDB Error';
  }

  return res.status(statusCode).json({
    status: 'fail',
    type,
    message,
  });
};
