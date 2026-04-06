export {};

declare global {
  namespace Express {
    interface Request {
      validatedParams?: Record<string, unknown>;
    }
  }
}
