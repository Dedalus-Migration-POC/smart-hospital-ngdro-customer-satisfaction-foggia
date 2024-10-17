import {BaseDTO} from "./base_dto";
import {DateRange} from "./date_range";

export type SurveyPersistRequest = BaseDTO & {
  validityDates?: DateRange;
  sectionIds: Array<number>;
}
