import { z } from 'zod';
import { SeverityNc } from '../enums/severity_nc.enum';
import { StatusNc } from '../enums/status_nc.enum';
import { TypeNc } from '../enums/type_nc.enum';

export const updateNonConformitySchema = z.object({
  title: z.string('title deve ser uma string').min(3, 'title deve ter no mínimo 3 caracteres').optional(),

  description: z.string('description deve ser uma string').min(3, 'description deve ter no mínimo 3 caracteres').optional(),

  type: z
    .enum(TypeNc, {
      message: 'type deve ser um valor de enum válido: 0 - PRODUTO, 1 - PROCESSO, 2 - MATERIAL, 3 - SEGURANÇA, 4 - OUTRO',
    })
    .optional(),

  severity: z
    .enum(SeverityNc, {
      message: 'severity deve ser um valor de enum válido: 0 - BAIXA, 1 - MEDIA, 2 - ALTA, 3 - CRITICA',
    })
    .optional(),

  status: z
    .enum(StatusNc, {
      message:
        'status deve ser um valor de enum válido: 0 - ABERTA, 1 - EM_TRATAMENTO, 2 - AGUARDANDO_VERIFICACAO, 3 - ENCERRADA, 4 - CANCELADA',
    })
    .optional(),

  processLine: z.string('processLine deve ser uma string').min(3, 'processLine deve ter no mínimo 3 caracteres').optional(),

  department: z.string('department deve ser uma string').min(3, 'department deve ter no mínimo 3 caracteres').optional(),

  rootCause: z.string('rootCause deve ser uma string').min(3, 'rootCause deve ter no mínimo 3 caracteres').optional(),

  assignedToId: z.string('assignedToId deve ser uma string').uuid('assignedToId deve ser um UUID válido').optional(),
});

export type UpdateNonConformityDTO = z.infer<typeof updateNonConformitySchema>;
