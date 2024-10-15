import {BaseDTO} from "./base_dto";
import {Section} from "./section";
import {DateRange} from "./date_range";

export type CreateSurveyRequest = BaseDTO & {
  dateRange?: DateRange;
  sections: Array<Section | null>;
}
