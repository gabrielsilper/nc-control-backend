import type { NextFunction, Request, Response } from "express";
import type { ZodObject } from "zod";

export const validateBody = (schema: ZodObject) => {
	return async (req: Request, _res: Response, next: NextFunction) => {
		try {
			const validatedData = await schema.parseAsync(req.body);
			req.body = validatedData;
			next();
		} catch (error) {
			next(error);
		}
	};
};