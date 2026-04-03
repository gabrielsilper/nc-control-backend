import { Request, Response } from 'express';
import { LoginDTO } from 'schemas/login.schema';
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
}
