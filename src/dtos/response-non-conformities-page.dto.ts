import ResponseNonConformityDTO from './response-non-conformity.dto';

export default interface ResponseNonConformitiesPageDTO {
  items: ResponseNonConformityDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
}
