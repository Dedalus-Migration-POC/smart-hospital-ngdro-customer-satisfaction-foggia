import { createReducer, on } from '@ngrx/store'
import * as QuestionnaireActions from './actions'
import { IQuestionnaire } from '../../questionnaire/state/service'
import { HealthcareUnit } from './service'

export const featureKey = 'authState'
export interface State {
  questionnaire: IQuestionnaire | null
  questionnaireLoading: boolean
  questionnaireError: boolean
  healthcareUnit: HealthcareUnit | null
  loading: boolean
  error: boolean
}

export const initialState: State = {
  questionnaire: null,
  questionnaireLoading: false,
  questionnaireError: false,
  healthcareUnit: null,
  loading: false,
  error: false,
}

export const reducer = createReducer(
  initialState,

  on(QuestionnaireActions.getHealthcareUnit, (state) => ({
    ...state,
    loading: true,
    error: false,
  })),
  on(QuestionnaireActions.getHealthcareUnitSuccess, (state, actin) => ({
    ...state,
    healthcareUnit: actin.data,
    loading: false,
  })),
  on(QuestionnaireActions.getHealthcareUnitFailure, (state) => ({
    ...state,
    loading: false,
    error: true,
  })),

  on(QuestionnaireActions.sendOtp, (state) => ({
    ...state,
    loading: true,
    error: false,
  })),
  on(QuestionnaireActions.sendOtpSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(QuestionnaireActions.sendOtpFailure, (state) => ({
    ...state,
    loading: false,
    error: true,
  })),

  on(QuestionnaireActions.fetchQuestionnaire, (state) => ({
    ...state,
    questionnaireLoading: true,
    questionnaireError: false,
  })),
  on(QuestionnaireActions.fetchQuestionnaireSuccess, (state, action) => ({
    ...state,
    questionnaireLoading: false,
    questionnaire: action.data,
  })),
  on(QuestionnaireActions.fetchQuestionnaireFailure, (state) => ({
    ...state,
    questionnaireLoading: false,
    questionnaireError: true,
  })),
)
