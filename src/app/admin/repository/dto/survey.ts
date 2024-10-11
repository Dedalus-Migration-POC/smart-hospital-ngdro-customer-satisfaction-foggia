import {BaseDTO, DeletableDTO, VersionableDTO} from "./base_dto";
import {Section} from "./section";

export type Survey = BaseDTO & DeletableDTO & VersionableDTO & {
  createdAt: Date;
  startDate: Date;
  endDate?: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  sections: Array<Section>;
  results: any[]
}
