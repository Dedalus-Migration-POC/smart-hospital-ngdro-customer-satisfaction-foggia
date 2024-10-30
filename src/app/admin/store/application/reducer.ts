import {createFeatureSelector, createReducer, createSelector, on} from "@ngrx/store";
import {AppActions} from "./actions";
import {User} from "../../repository/dto/user";

export type State = {
  initializing: boolean;
  initializeError: boolean;
  loggingIn: boolean;
  user: User | null
}

const initialState: State = {
  initializing: false,
  initializeError: false,
  loggingIn: false,
  user: null
}

export const reducer = createReducer(
  initialState,
  on(AppActions.initialize, (state) => ({
    ...state,
    initializing: true,
    initializeError: false,
  })),
  on(AppActions.initializeSucceeded, (state) => ({
    ...state,
    initializing: false,
    initializeError: false,
  })),
  on(AppActions.initializeFailed, (state) => ({
    ...state,
    initializing: false,
    initializeError: true,
  })),
  on(AppActions.login, (state) => ({
    ...state,
    loggingIn: true,
    user: null,
  })),
  on(AppActions.loginSucceeded, (state, action) => ({
    ...state,
    loggingIn: false,
    user: action.user,
  })),
  on(AppActions.loginFailed, (state) => ({
    ...state,
    loggingIn: false,
    user: null,
  })),
  on(AppActions.logout, (state) => ({
    ...state,
  })),
  on(AppActions.logoutSucceeded, (state) => ({
    ...state,
    user: null,
  })),
  on(AppActions.logoutFailed, (state) => ({
    ...state,
  })),
)

export const selectApplicationState = createFeatureSelector<State>('application');
export const selectUser = createSelector(selectApplicationState, ({user}) => (user))
