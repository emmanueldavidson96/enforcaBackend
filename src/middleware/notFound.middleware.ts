import { NextFunction, Request, Response } from 'express';

export const notFound = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    throw new Error(
      `Route not found : ${req.method} : ${req.originalUrl}`,
    );
  } catch (error) {
    next(error);
  }
};
