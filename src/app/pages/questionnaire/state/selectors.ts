import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as questState from './reducer'

export const selectquestState = createFeatureSelector<questState.State>(
  questState.featureKey,
)

export const selectQuestionnaireForm = createSelector(
  selectquestState,
  (state) => state.questionnaire,
)
