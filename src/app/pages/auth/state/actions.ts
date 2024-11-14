import { createAction, props } from '@ngrx/store'
import { IQuestionnaireResponse } from '../../questionnaire/state/service'

export const sendOtp = createAction(
  '[Auth] Send Otp',
  props<{
    otp: string
    payload: { surveyId: string }
  }>(),
)

export const sendOtpSuccess = createAction('[Auth] Send Otp Success')

export const sendOtpFailure = createAction(
  '[Auth] Send Otp Failure',
  props<{ error: any }>(),
)

export const fetchQuestionnaire = createAction(
  '[Auth] Fetch Questionnaire',
  props<{ surveyId: string }>(),
)

export const fetchQuestionnaireSuccess = createAction(
  '[Auth] Fetch Questionnaire Success',
  props<{ data: IQuestionnaireResponse }>(),
)

export const fetchQuestionnaireFailure = createAction(
  '[Auth] Fetch Questionnaire Failure',
  props<{ error: any }>(),
)
