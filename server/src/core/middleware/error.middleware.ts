import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/api.error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  if (err.message === 'Unauthorized') {
    return res.status(401).json({ error: err.message });
  }

  res.status(400).json({ 
    error: err.message || 'Something went wrong' 
  });
};