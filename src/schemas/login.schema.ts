import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string('email é obrigatório e deve ser uma string')
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'email deve ser um endereço de e-mail válido'),

  password: z
    .string('password é obrigatório e deve ser uma string')
    .min(8, 'password deve ter no mínimo 8 caracteres')
    .max(25, 'password deve ter no máximo 25 caracteres'),
});

export type LoginDTO = z.infer<typeof loginSchema>;
