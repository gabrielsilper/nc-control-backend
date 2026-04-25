import { z } from 'zod';
import { SeverityNc } from '../enums/severity_nc.enum';
import { TypeNc } from '../enums/type_nc.enum';

export const createNonConformitySchema = z.object({
  title: z.string('title é obrigatório e deve ser uma string').min(3, 'title deve ter no mínimo 3 caracteres'),

  description: z
    .string('description é obrigatório e deve ser uma string')
    .min(3, 'description deve ter no mínimo 3 caracteres'),

  type: z.enum(TypeNc, {
    message: 'type deve ser um valor de enum válido: 0 - PRODUTO, 1 - PROCESSO, 2 - MATERIAL, 3 - SEGURANÇA, 4 - OUTRO',
  }),

  severity: z.enum(SeverityNc, {
    message: 'severity deve ser um valor de enum válido: 0 - BAIXA, 1 - MEDIA, 2 - ALTA, 3 - CRITICA',
  }),

  processLine: z
    .string('processLine é obrigatório e deve ser uma string')
    .min(3, 'processLine deve ter no mínimo 3 caracteres'),

  department: z.string('department é obrigatório e deve ser uma string').min(3, 'department deve ter no mínimo 3 caracteres'),

  rootCause: z.string('rootCause deve ser uma string').min(3, 'rootCause deve ter no mínimo 3 caracteres').optional(),

  assignedToId: z.string('assignedToId deve ser uma string').uuid('assignedToId deve ser um UUID válido').optional(),
});

export type CreateNonConformityDTO = z.infer<typeof createNonConformitySchema>;
