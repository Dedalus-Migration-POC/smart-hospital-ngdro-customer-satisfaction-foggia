import {HealthcareUnitStructure} from "./healthcare-unit";

export type PrintSurveyRequest = {
  surveyId: number;
  healthcareUnitId: number;
  structure: HealthcareUnitStructure;
  copies: number;
}
