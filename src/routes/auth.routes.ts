import { getEnvNumberOrThrow } from 'config/environment';
import { Router } from 'express';
import { validateBody } from 'middlewares/validate-body.middleware';
import { ValidateTokenMiddleware } from 'middlewares/validate-token.middleware';
import { loginSchema } from 'schemas/login.schema';
import { refreshTokenSchema } from 'schemas/refresh-token.schema';
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
const authController = new AuthController(authService, userService);
const validateTokenMiddleware = new ValidateTokenMiddleware(tokenService);

const authRoutes = Router();

authRoutes.post('/login', validateBody(loginSchema), (req, res) => authController.login(req, res));
authRoutes.post('/refresh', validateBody(refreshTokenSchema), (req, res) => authController.refresh(req, res));
authRoutes.post('/logout', validateBody(refreshTokenSchema), (req, res) => authController.logout(req, res));
authRoutes.post(
  '/logout/all',
  (req, res, next) => validateTokenMiddleware.handle(req, res, next),
  (req, res) => authController.logoutAll(req, res),
);

authRoutes.get(
  '/me',
  (req, res, next) => validateTokenMiddleware.handle(req, res, next),
  (req, res) => authController.me(req, res),
);

export default authRoutes;
