import {BaseDTO, VersionableDTO} from "./base_dto";
import {DateRange} from "./date_range";

export type SurveyPersistRequest = BaseDTO & VersionableDTO & {
  validityDates?: DateRange;
  sectionIds: Array<number>;
}
