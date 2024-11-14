import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as authState from './reducer'

export const selectAuthState = createFeatureSelector<authState.State>(
  authState.featureKey,
)

export const selectQuestionnaireData = createSelector(
  selectAuthState,
  (state) => state.questionnaire,
)
export const selectQuestionnaireLoading = createSelector(
  selectAuthState,
  (state) => state.questionnaireLoading,
)
export const selectQuestionnaireError = createSelector(
  selectAuthState,
  (state) => state.questionnaireError,
)
