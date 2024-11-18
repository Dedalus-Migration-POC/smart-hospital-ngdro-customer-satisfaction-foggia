import {Survey} from "./survey";
import {HealthcareUnit} from "./healthcare-unit";

export type PrintDataResponse = {
  surveys: Array<Survey>
  healthcareUnits: Array<HealthcareUnit>
}
