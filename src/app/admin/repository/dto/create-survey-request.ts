import {BaseDTO} from "./base_dto";
import {Section} from "./section";

export type CreateSurveyRequest = BaseDTO & {
  startDate: Date,
  endDate?: Date,
  sections: Array<Section | null>,
}
