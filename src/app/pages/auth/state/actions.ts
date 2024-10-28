import { createAction, props } from '@ngrx/store'
import { IQuestionnaire } from '../../questionnaire/state/service'
import { HealthcareUnit } from './service'

export const getHealthcareUnit = createAction(
  '[Quest] getHealthcareUnit',
  props<{ healthcareUnitId: string }>(),
)

export const getHealthcareUnitSuccess = createAction(
  '[Quest] getHealthcareUnit Success',
  props<{ data: HealthcareUnit }>(),
)

export const getHealthcareUnitFailure = createAction(
  '[Quest] getHealthcareUnit Failure',
  props<{ error: any }>(),
)

export const sendOtp = createAction(
  '[Auth] Send Otp',
  props<{
    otp: string
    payload: { surveyId: string; healthcareUnitId: string; structure: string }
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
  props<{ data: IQuestionnaire }>(),
)

export const fetchQuestionnaireFailure = createAction(
  '[Auth] Fetch Questionnaire Failure',
  props<{ error: any }>(),
)
