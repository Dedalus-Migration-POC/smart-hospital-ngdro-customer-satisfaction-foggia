import { createAction, props } from '@ngrx/store'
import { IQuestionnaire } from './service'

export const setQuestionnaire = createAction(
  '[Quest] Set Questionnaire',
  props<{ payload: any }>(),
)

export const sendQuestionnaire = createAction(
  '[Quest] Send Questionnaire',
  props<{ payload: IQuestionnaire }>(),
)

export const sendQuestionnaireSuccess = createAction(
  '[Quest] Send Questionnaire Success',
  props<{ data: any }>(),
)

export const sendQuestionnaireFailure = createAction(
  '[Quest] Send Questionnaire Failure',
  props<{ error: any }>(),
)
