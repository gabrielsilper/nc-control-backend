import { CorrectiveActionForbiddenError } from 'errors/corrective-action-forbidden.error';
import { CorrectiveActionMissingEvidenceError } from 'errors/corrective-action-missing-evidence.error';
import { CorrectiveActionNotFoundError } from 'errors/corrective-action-not-found.error';
import { EmailAlreadyExistsError } from 'errors/email-already-exists.error';
import { InvalidCredentialsError } from 'errors/invalid-credentials.error';
import { InvalidNonConformityStatusTransitionError } from 'errors/invalid-non-conformity-status-transition.error';
import { NcMissingAssigneeError } from 'errors/nc-missing-assignee.error';
import { NonConformityMissingRootCauseError } from 'errors/nc-missing-root-cause.error';
import { NonConformityNumberAlreadyExistsError } from 'errors/nc-number-already-exists.error';
import { NonConformityMissingAssignmentRequirementsError } from 'errors/non-conformity-missing-assignment-requirements.error';
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

  if (
    error instanceof UserNotFoundError ||
    error instanceof NonConformityNotFoundError ||
    error instanceof CorrectiveActionNotFoundError
  ) {
    return res.status(404).json({
      error: error.name,
      message: error.message,
    });
  }

  if (error instanceof CorrectiveActionForbiddenError) {
    return res.status(403).json({
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

  if (
    error instanceof InvalidNonConformityStatusTransitionError ||
    error instanceof NonConformityMissingRootCauseError ||
    error instanceof NonConformityMissingAssignmentRequirementsError ||
    error instanceof NcMissingAssigneeError ||
    error instanceof CorrectiveActionMissingEvidenceError
  ) {
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

  return res.status(500).json({ message: 'Internal server error' });
}
