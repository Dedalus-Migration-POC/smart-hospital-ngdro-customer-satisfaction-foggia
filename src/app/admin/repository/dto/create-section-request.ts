import {BaseDTO, VersionableDTO} from "./base_dto";
import {Question} from "./section";

export type CreateSectionRequest = BaseDTO & VersionableDTO & {
  questions: Array<Partial<Question>>
}
