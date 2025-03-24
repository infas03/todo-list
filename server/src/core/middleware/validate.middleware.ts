import { Request, Response, NextFunction } from 'express';
import { validate as classValidate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ApiError } from '../errors/api.error';

export const validate = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToInstance(dtoClass, req.body);

      const errors = await classValidate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true
      });

      if (errors.length > 0) {
        const message = errors
          .map(error => Object.values(error.constraints || {}))
          .join(', ');
        throw new ApiError(400, message);
      }

      req.body = dto;
      next();
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ error: error.message });
      }
      next(error);
    }
  };
};