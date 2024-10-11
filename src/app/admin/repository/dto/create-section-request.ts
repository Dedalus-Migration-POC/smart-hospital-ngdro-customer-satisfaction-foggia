import {BaseDTO} from "./base_dto";
import {Question} from "./section";

export type CreateSectionRequest = BaseDTO & {
  questions: Array<Partial<Question>>
}
