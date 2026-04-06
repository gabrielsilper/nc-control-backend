import { NextFunction, Request, Response } from 'express';
import ITokenService from 'interfaces/token-service';

export class ValidateTokenMiddleware {
  constructor(private readonly tokenService: ITokenService) {}

  handle(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization?.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'TokenNotFoundError',
        message: 'Token não encontrado ou formato inválido',
      });
    }

    try {
      const token = authorization.replace('Bearer ', '');
      req.payload = this.tokenService.verifyAccessToken(token);
    } catch (_error) {
      return res.status(401).json({
        error: 'InvalidTokenError',
        message: 'Token deve ser um token válido',
      });
    }

    next();
  }
}
