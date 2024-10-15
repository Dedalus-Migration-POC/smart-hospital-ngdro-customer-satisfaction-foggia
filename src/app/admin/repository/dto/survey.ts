import {BaseDTO, DeletableDTO, VersionableDTO} from "./base_dto";
import {Section} from "./section";
import {DateRange} from "./date_range";

export type Survey = BaseDTO & DeletableDTO & VersionableDTO & {
  createdAt: Date;
  dateRange?: DateRange;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  sections: Array<Section>;
  results: any[]
}
