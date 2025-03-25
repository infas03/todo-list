import { Request, Response } from 'express';
import { sendResponse } from '../utils/apiResponse';
import { HttpStatus } from '../constants/httpStatus';

export const errorHandler = (err: Error, req: Request, res: Response) => {
  sendResponse(res, {
    success: false,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    data: null
  });
};
