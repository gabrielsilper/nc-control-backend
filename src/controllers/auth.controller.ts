import { Request, Response } from 'express';
import { LoginDTO } from 'schemas/login.schema';
import { RefreshTokenDTO } from 'schemas/refresh-token.schema';
import AuthService from 'services/auth.service';

export default class AuthController {
  constructor(private authService: AuthService) {}

  async login(req: Request, res: Response) {
    const userAgent = req.get('User-Agent') ?? 'unknown';
    const ip = req.ip;
    const { email, password } = req.body as LoginDTO;

    const tokens = await this.authService.login(email, password, userAgent, ip as string);

    res.status(200).json(tokens);
  }

  async refresh(req: Request, res: Response) {
    const userAgent = req.get('User-Agent') ?? 'unknown';
    const ip = req.ip;
    const { refreshToken } = req.body as RefreshTokenDTO;

    const tokens = await this.authService.refresh(refreshToken, userAgent, ip as string);

    res.status(200).json(tokens);
  }

  async logout(req: Request, res: Response) {
    const userAgent = req.get('User-Agent') ?? 'unknown';
    const { refreshToken } = req.body as RefreshTokenDTO;

    await this.authService.logout(refreshToken, userAgent);

    res.status(204).end();
  }

  async logoutAll(req: Request, res: Response) {
    await this.authService.logoutAll(req.payload.sub);

    res.status(204).end();
  }
}
