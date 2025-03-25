import { Response } from 'express';

export const sendResponse = (
  res: Response,
  options: {
    success: boolean;
    statusCode: number;
    message: string;
    data?: any;
    meta?: any;
  }
) => {
  res.status(options.statusCode).json({
    success: options.success,
    statusCode: options.statusCode,
    message: options.message,
    data: options.data || null,
    meta: options.meta || undefined
  });
};