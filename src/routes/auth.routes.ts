import { getEnvNumberOrThrow } from 'config/environment';
import { Router } from 'express';
import { validateBody } from 'middlewares/validate-body.middleware';
import { loginSchema } from 'schemas/login.schema';
import AuthController from '../controllers/auth.controller';
import RefreshTokenRepository from '../repositories/refresh-token.repository';
import UserRepository from '../repositories/user.repository';
import AuthService from '../services/auth.service';
import RefreshTokenService from '../services/refresh-token.service';
import { TokenService } from '../services/token.service';
import UserService from '../services/user.service';
import Bcrypt from '../utils/bcrypt';

const expiresDays = getEnvNumberOrThrow('EXPIRES_DAYS');

const encrypter = new Bcrypt();
const userRepository = new UserRepository();
const userService = new UserService(userRepository, encrypter);
const refreshTokenRepository = new RefreshTokenRepository();
const tokenService = new TokenService();
const refreshTokenService = new RefreshTokenService(refreshTokenRepository, tokenService, expiresDays);
const authService = new AuthService(userService, refreshTokenService, tokenService, encrypter);
const authController = new AuthController(authService);

const authRoutes = Router();

authRoutes.post('/login', validateBody(loginSchema), (req, res) => authController.login(req, res));

export default authRoutes;
