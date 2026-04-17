import type { NextFunction, Request, Response } from 'express';
import type { ZodObject } from 'zod';

export const validateQuery = (schema: ZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const values = await schema.parseAsync(req.query);
      req.validatedQuery = values;
      next();
    } catch (error) {
      next(error);
    }
  };
};
