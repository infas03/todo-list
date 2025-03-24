import { ApiError } from "../errors/api.error";
import { Request, Response } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
};