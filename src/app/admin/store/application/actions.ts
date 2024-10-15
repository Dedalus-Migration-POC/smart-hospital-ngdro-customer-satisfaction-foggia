import {createAction, props} from '@ngrx/store'
import {Survey} from "../../repository/dto/survey";
import {Section} from "../../repository/dto/section";
import {UserRole} from "../../repository/dto/user";

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

const login = createAction(
  '[Survey] Login',
  props<{ userRole: UserRole }>(),
)

const loginSucceeded = createAction(
  '[Survey] Login Succeeded',
  props<{ user: any }>(),
)

const loginFailed = createAction(
  '[Survey] Login Failed',
)

export const AppActions = {
  initialize,
  initializeSucceeded,
  initializeFailed,
  login,
  loginSucceeded,
  loginFailed,
}

export type SurveyActionTypes =
  typeof initialize
  | typeof initializeSucceeded
  | typeof initializeFailed
  | typeof login
  | typeof loginSucceeded
  | typeof loginFailed
