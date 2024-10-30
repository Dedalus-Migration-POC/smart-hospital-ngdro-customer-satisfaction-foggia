import {DateRange} from "./date_range";
import {SurveyStatus} from "./survey";

export type FilterSurveyRequest = {
  name?: string;
  status?: SurveyStatus;
  version?: number;
  dateRange?: DateRange;
}
