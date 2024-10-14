import {createFeatureSelector, createReducer, on} from "@ngrx/store";
import {AppActions} from "./actions";

export type State = {
  initializing: boolean
  initializeError: boolean
}

const initialState: State = {
  initializing: false,
  initializeError: false,
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
)

export const selectApplicationState = createFeatureSelector<State>('application');
