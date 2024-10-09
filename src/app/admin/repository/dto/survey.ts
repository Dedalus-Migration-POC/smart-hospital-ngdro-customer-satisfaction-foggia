import {BaseDTO, DeletableDTO, VersionableDTO} from "./base_dto";

export type Survey = BaseDTO & DeletableDTO & VersionableDTO & {
  sections: any[];
  results: any[]
}
