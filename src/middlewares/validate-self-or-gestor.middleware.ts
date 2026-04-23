import { Profile } from 'enums/profile.enum';
import { NextFunction, Request, Response } from 'express';

// Permite acesso ao GESTOR (pode acessar qualquer usuário) ou ao próprio usuário (só pode acessar a si mesmo).
export function validateSelfOrGestor(req: Request, res: Response, next: NextFunction) {
  const { sub, profile } = req.payload;

  if (profile === Profile.GESTOR || sub === req.params.id) {
    return next();
  }

  return res.status(403).json({
    error: 'AuthorizationError',
    message: 'Você não tem permissão para acessar este recurso!',
  });
}
