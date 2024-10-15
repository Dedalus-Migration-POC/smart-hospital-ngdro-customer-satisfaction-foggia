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

const logout = createAction(
  '[Survey] Logout',
)

const logoutSucceeded = createAction(
  '[Survey] Logout Succeeded',
)

const logoutFailed = createAction(
  '[Survey] Logout Failed',
)

export const AppActions = {
  initialize,
  initializeSucceeded,
  initializeFailed,
  login,
  loginSucceeded,
  loginFailed,
  logout,
  logoutSucceeded,
  logoutFailed,
}

export type SurveyActionTypes =
  typeof initialize
  | typeof initializeSucceeded
  | typeof initializeFailed
  | typeof login
  | typeof loginSucceeded
  | typeof loginFailed
  | typeof logout
  | typeof logoutSucceeded
  | typeof logoutFailed
