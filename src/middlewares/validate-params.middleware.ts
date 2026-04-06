import type { NextFunction, Request, Response } from 'express';
import type { ZodObject } from 'zod';

export const validateParams = (schema: ZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const values = await schema.parseAsync(req.params);
      req.validatedParams = values;
      next();
    } catch (error) {
      next(error);
    }
  };
};
