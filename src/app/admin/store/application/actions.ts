import {createAction, props} from '@ngrx/store'
import {Survey} from "../../repository/dto/survey";
import {Section} from "../../repository/dto/section";

const initialize = createAction(
  '[Survey] Initialize',
)

const initializeSucceeded = createAction(
  '[Survey] Initialize Succeeded',
  props<{ surveys: Array<Survey>, sections: Array<Section> }>(),
)

const initializeFailed = createAction(
  '[Survey] Initialize Failed',
)

export const AppActions = {
  initialize,
  initializeSucceeded,
  initializeFailed,
}

export type SurveyActionTypes =
  typeof initialize
  | typeof initializeSucceeded
  | typeof initializeFailed
