import { appDataSource } from "database/app-data-source";
import NonConformity from "entities/non-conformity";
import { Repository } from "typeorm";

export default class NonConformityRepository extends Repository<NonConformity> {
  constructor() {
    super(NonConformity, appDataSource.manager);
  }
}