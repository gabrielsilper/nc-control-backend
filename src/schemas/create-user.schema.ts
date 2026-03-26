import { z } from 'zod';
import { Profile } from '../enums/profile.enum';

export const createUserSchema = z.object({
  name: z
    .string('name é obrigatório e deve ser uma string')
    .min(3, 'name deve ter no mínimo 3 caracteres')
    .max(50, 'name deve ter no máximo 50 caracteres')
    .regex(/^[a-zA-Z\s]+$/, 'name pode conter apenas letras e espaços'),

  password: z
    .string('password é obrigatório e deve ser uma string')
    .min(8, 'password deve ter no mínimo 8 caracteres')
    .max(25, 'password deve ter no máximo 25 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
      'password deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
    ),

  email: z
    .string('email é obrigatório e deve ser uma string')
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'email deve ser um endereço de e-mail válido',
    ),

  profile: z.enum(Profile, {
    message:
      'profile deve ser um valor de enum válido: 0 - OPERADOR, 1 - RESPONSÁVEL, 2 - GESTOR',
  }),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
