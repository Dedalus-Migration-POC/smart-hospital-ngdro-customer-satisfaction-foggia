import {BaseDTO, DeletableDTO, VersionableDTO} from "./base_dto";

export type Section = BaseDTO & DeletableDTO & VersionableDTO & {
  questions?: Array<Question>;
}

export type Question = BaseDTO & DeletableDTO & {
  answerType: 'RATE' | 'MULTI'
  answers?: Array<Answer>
}

export type Answer = BaseDTO & DeletableDTO & {
  value: number
}
