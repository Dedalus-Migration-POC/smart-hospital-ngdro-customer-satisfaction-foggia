import { createReducer, on } from '@ngrx/store'
import * as QuestionnaireActions from './actions'
import { IQuestionnaireResponse } from '../../questionnaire/state/service'

export const featureKey = 'authState'
export interface State {
  questionnaire: IQuestionnaireResponse | null
  questionnaireLoading: boolean
  questionnaireError: { flag: boolean; type: string } //  expired / compiled /notFound
}

export const initialState: State = {
  questionnaire: null,
  questionnaireLoading: false,
  questionnaireError: { flag: false, type: '' },
}

export const reducer = createReducer(
  initialState,

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
    questionnaireError: { flag: false, type: '' },
  })),
  on(QuestionnaireActions.fetchQuestionnaireSuccess, (state, action) => ({
    ...state,
    questionnaireLoading: false,
    questionnaire: action.data,
  })),
  on(QuestionnaireActions.fetchQuestionnaireFailure, (state, action) => ({
    ...state,
    questionnaireLoading: false,
    questionnaireError: { flag: true, type: action.error.type },
  })),
)
