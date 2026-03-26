import { z } from 'zod';
import { Profile } from '../enums/profile.enum';

export const createUserSchema = z.object({
  name: z
    .string('Name is required and must be a string')
    .min(3, 'Name must have at least 3 characters')
    .max(50, 'Name must have at most 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

  password: z
    .string('Password is required and must be a string')
    .min(8, 'Password must have at least 8 characters')
    .max(25, 'Password must have at most 25 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),

  email: z
    .string('Email is required and must be a string')
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email must be a valid email address',
    ),

  profile: z.enum(Profile, {
    message:
      'Profile must be a valid enum value: 0 - OPERADOR, 1 - RESPONSAVEL, 2- GESTOR',
  }),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
