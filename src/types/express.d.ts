import { AccessTokenPayload } from 'interfaces/token-service';

declare global {
  namespace Express {
    interface Request {
      payload: AccessTokenPayload;
      validatedParams?: Record<string, unknown>;
    }
  }
}
