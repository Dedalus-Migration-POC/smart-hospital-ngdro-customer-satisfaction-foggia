import { createAction, props } from '@ngrx/store'

export const fetchQuestionnaire = createAction(
  '[Auth] Fetch Questionnaire',
  props<{ payload: { otp: string; consent: boolean } }>(),
)

export const fetchQuestionnaireSuccess = createAction(
  '[Auth] Fetch Questionnaire Success',
  props<{ data: any }>(),
)

export const fetchQuestionnaireFailure = createAction(
  '[Auth] Fetch Questionnaire Failure',
  props<{ error: any }>(),
)
