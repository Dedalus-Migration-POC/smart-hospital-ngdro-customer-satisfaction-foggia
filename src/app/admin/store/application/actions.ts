import { createAction, props } from '@ngrx/store'
import { User, UserRole } from '../../repository/dto/user'

const initialize = createAction('[SurveyApp] Initialize')

const initializeSucceeded = createAction(
  '[SurveyApp] Initialize Succeeded',
  props<{ user: User }>(),
)

const initializeFailed = createAction('[SurveyApp] Initialize Failed')

const login = createAction(
  '[SurveyApp] Login',
  props<{
    payload: { username: string; password: string }
  }>(),
)

const loginSucceeded = createAction(
  '[SurveyApp] Login Succeeded',
  props<{ user: User }>(),
)

const loginFailed = createAction('[SurveyApp] Login Failed')

const logout = createAction('[SurveyApp] Logout')

const logoutSucceeded = createAction('[SurveyApp] Logout Succeeded')

const logoutFailed = createAction('[SurveyApp] Logout Failed')

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
  | typeof initialize
  | typeof initializeSucceeded
  | typeof initializeFailed
  | typeof login
  | typeof loginSucceeded
  | typeof loginFailed
  | typeof logout
  | typeof logoutSucceeded
  | typeof logoutFailed
