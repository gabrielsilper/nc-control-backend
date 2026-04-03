import { z } from 'zod';

export const refreshTokenSchema = z.object({
  refreshToken: z.string('refreshToken é obrigatório e deve ser uma string'),
});

export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>;
