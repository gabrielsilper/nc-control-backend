import { SeverityNc } from 'enums/severity_nc.enum';
import { StatusNc } from 'enums/status_nc.enum';
import { TypeNc } from 'enums/type_nc.enum';

export default interface ResponseNonConformityDTO {
  id: string;
  number: string;
  title: string;
  description: string;
  type: TypeNc;
  severity: SeverityNc;
  status: StatusNc;
  processLine: string;
  department: string;
  rootCause?: string;
  createdById: string;
  assignedToId?: string;
  openedAt: Date;
  dueDate?: Date;
  closedAt?: Date | null;
}
