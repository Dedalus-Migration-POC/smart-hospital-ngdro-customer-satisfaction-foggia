import {BaseDTO, DeletableDTO, VersionableDTO} from "./base_dto";
import {Section} from "./section";
import {DateRange} from "./date_range";

export enum SurveyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
}

export type Survey = BaseDTO & DeletableDTO & VersionableDTO & {
  createdAt: Date;
  dateRange?: DateRange;
  status: SurveyStatus;
  sections: Array<Section>;
  results: any[]
}
