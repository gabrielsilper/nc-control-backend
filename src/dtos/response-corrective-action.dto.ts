import { StatusCa } from 'enums/status.enum';
import EmbeddedUserDTO from './embedded-user.dto';

export default interface ResponseCorrectiveActionDTO {
  id: string;
  description: string;
  status: StatusCa;
  deadline: Date;
  evidence?: string;
  nonConformityId: string;
  assignee: EmbeddedUserDTO;
  finishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
