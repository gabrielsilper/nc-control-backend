import { z } from 'zod';
import { Profile } from '../enums/profile.enum';

export const updateUserSchema = z.object({
  name: z
    .string('Name must be a string')
    .min(3, 'Name must have at least 3 characters')
    .max(50, 'Name must have at most 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .optional(),

  password: z
    .string('Password must be a string')
    .min(8, 'Password must have at least 8 characters')
    .max(25, 'Password must have at most 25 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    )
    .optional(),

  email: z
    .string('Email must be a string')
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email must be a valid email address',
    )
    .optional(),

  profile: z
    .enum(Profile, {
      message:
        'Profile must be a valid enum value: 0 - OPERADOR, 1 - RESPONSAVEL, 2- GESTOR',
    })
    .optional(),
});

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
