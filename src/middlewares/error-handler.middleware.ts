import { EmailAlreadyExistsError } from 'errors/email-already-exists.error';
import { InvalidCredentialsError } from 'errors/invalid-credentials.error';
import { InvalidNonConformityStatusTransitionError } from 'errors/invalid-non-conformity-status-transition.error';
import { NonConformityMissingRootCauseError } from 'errors/nc-missing-root-cause.error';
import { NonConformityNumberAlreadyExistsError } from 'errors/nc-number-already-exists.error';
import { NonConformityNotFoundError } from 'errors/non-conformity-not-found.error';
import RefreshTokenValidationError from 'errors/refresh-token-validation.error';
import { UserNotFoundError } from 'errors/user-not-found.error';
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

// TODO - Colocar uma criação de log desse erros com winston e criar um tabela para armazenar as informações
export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof InvalidCredentialsError || error instanceof RefreshTokenValidationError) {
    return res.status(401).json({
      error: error.name,
      message: error.message,
    });
  }

  if (error instanceof UserNotFoundError || error instanceof NonConformityNotFoundError) {
    return res.status(404).json({
      error: error.name,
      message: error.message,
    });
  }

  if (error instanceof EmailAlreadyExistsError || error instanceof NonConformityNumberAlreadyExistsError) {
    return res.status(409).json({
      error: error.name,
      message: error.message,
    });
  }

  if (error instanceof InvalidNonConformityStatusTransitionError || error instanceof NonConformityMissingRootCauseError) {
    return res.status(400).json({
      error: error.name,
      message: error.message,
    });
  }

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
