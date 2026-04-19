import { StatusCa } from 'enums/status.enum';

export default interface ResponseCorrectiveActionDTO {
  id: string;
  description: string;
  status: StatusCa;
  deadline: Date;
  evidence?: string;
  nonConformityId: string;
  assigneeId: string;
  finishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
