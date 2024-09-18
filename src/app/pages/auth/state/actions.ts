import { createAction, props } from '@ngrx/store'
import { IQuestionnaire } from '../../questionnaire/state/service'

export const fetchQuestionnaire = createAction(
  '[Auth] Fetch Questionnaire',
  props<{ payload: { otp: string; consent: boolean } }>(),
)

export const fetchQuestionnaireSuccess = createAction(
  '[Auth] Fetch Questionnaire Success',
  props<{ data: IQuestionnaire }>(),
)

export const fetchQuestionnaireFailure = createAction(
  '[Auth] Fetch Questionnaire Failure',
  props<{ error: any }>(),
)
