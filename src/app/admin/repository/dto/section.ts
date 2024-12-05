import {BaseDTO, VersionableDTO} from "./base_dto";
import {Survey} from "./survey";

export type Section = BaseDTO & VersionableDTO & {
  questions?: Array<Question>;
  associatedSurveys?: Array<Pick<Survey, 'id' | 'name' | 'version'>>
}

export type Question = BaseDTO & {
  answerType: 'RATE' | 'MULTI';
  answers?: Array<Answer>;
}

export type Answer = BaseDTO & {
  value: string;
}
