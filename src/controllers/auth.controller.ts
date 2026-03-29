import LoginDto from 'dtos/login.dto';
import { Request, Response } from 'express';
import AuthService from 'services/auth.service';

export default class AuthController {
  constructor(private authService: AuthService) {}

  async login(req: Request, res: Response) {
    const userAgent = req.get('User-Agent') ?? 'unknown';
    const ip = req.ip;
    const { email, password } = req.body as LoginDto;

    const tokens = await this.authService.login(email, password, userAgent, ip as string);

    res.status(200).json(tokens);
  }
}
