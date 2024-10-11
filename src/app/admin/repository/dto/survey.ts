import {BaseDTO, DeletableDTO, VersionableDTO} from "./base_dto";
import {Section} from "./section";

export type Survey = BaseDTO & DeletableDTO & VersionableDTO & {
  sections: Array<Section>;
  results: any[]
}
