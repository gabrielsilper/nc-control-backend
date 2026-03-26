import { z } from 'zod';
import { Profile } from '../enums/profile.enum';

export const updateUserSchema = z.object({
  name: z
    .string('name deve ser uma string')
    .min(3, 'name deve ter no mínimo 3 caracteres')
    .max(50, 'name deve ter no máximo 50 caracteres')
    .regex(/^[a-zA-Z\s]+$/, 'name pode conter apenas letras e espaços')
    .optional(),

  password: z
    .string('password deve ser uma string')
    .min(8, 'password deve ter no mínimo 8 caracteres')
    .max(25, 'password deve ter no máximo 25 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
      'password deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
    )
    .optional(),

  email: z
    .string('E-mail deve ser uma string')
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'E-mail deve ser um endereço de e-mail válido',
    )
    .optional(),

  profile: z
    .enum(Profile, {
      message:
        'profile deve ser um valor de enum válido: 0 - OPERADOR, 1 - RESPONSÁVEL, 2 - GESTOR',
    })
    .optional(),
});

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
