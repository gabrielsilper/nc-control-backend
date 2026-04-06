import { Profile } from 'enums/profile.enum';
import { NextFunction, Request, Response } from 'express';

export function validateProfileAuth(profileWithAcess: Profile, restrict: boolean = false) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { profile } = req.payload;

    const authorizationErrorResponse = {
      error: 'AuthorizationError',
      message: 'Você não tem permissão para acessar este recurso!',
    };

    if (!restrict && profile < profileWithAcess) {
      return res.status(401).json(authorizationErrorResponse);
    }

    if (restrict && profile !== profileWithAcess) {
      return res.status(401).json(authorizationErrorResponse);
    }

    next();
  };
}
