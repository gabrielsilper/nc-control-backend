import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

// TODO - Colocar uma criação de log desse erros com winston e criar um tabela para armazenar as informações
export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    });
  }

  return res.status(500).json({
    // TODO - Remover o stack e message futuramente
    message: 'Internal server error',
    error: error.message,
    stack: error.stack,
  });
}
