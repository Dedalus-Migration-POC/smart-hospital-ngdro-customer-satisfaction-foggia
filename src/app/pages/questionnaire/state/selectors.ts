import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as questState from './reducer'

export const selectquestState = createFeatureSelector<questState.State>(
  questState.featureKey,
)

export const selectQuestionnaireForm = createSelector(
  selectquestState,
  (state) => state.questionnaire,
)

export const selectSendQuestionnaireLoading = createSelector(
  selectquestState,
  (state) => state.sendQuestionnaireLoading,
)
export const selectSendQuestionnaireError = createSelector(
  selectquestState,
  (state) => state.sendQuestionnaireError,
)

export const selectIsSurveyConfirmed = createSelector(
  selectquestState,
  (state) => state.isSurveyConfirmed,
)
