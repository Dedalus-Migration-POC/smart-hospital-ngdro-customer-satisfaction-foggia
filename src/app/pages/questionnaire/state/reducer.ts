import { createReducer, on } from '@ngrx/store'
import * as QuestionnaireActions from './actions'

export const featureKey = 'questState'

export interface State {
  questionnaire: any[]
  sendQuestionnaireLoading: boolean
  sendQuestionnaireError: boolean
  isSurveyConfirmed: boolean
}

export const initialState: State = {
  questionnaire: [],
  sendQuestionnaireLoading: false,
  sendQuestionnaireError: false,
  isSurveyConfirmed: false,
}

export const reducer = createReducer(
  initialState,
  on(QuestionnaireActions.setQuestionnaire, (state, action) => ({
    ...state,
    questionnaire: state.questionnaire
      .filter((item) => item.id !== action.payload.id)
      .concat(action.payload),
  })),

  on(QuestionnaireActions.sendQuestionnaire, (state) => ({
    ...state,
    sendQuestionnaireLoading: true,
    sendQuestionnaireError: false,
  })),
  on(QuestionnaireActions.sendQuestionnaireSuccess, (state) => ({
    ...state,
    sendQuestionnaireLoading: false,
  })),
  on(QuestionnaireActions.sendQuestionnaireFailure, (state) => ({
    ...state,
    sendQuestionnaireLoading: false,
    sendQuestionnaireError: true,
  })),

  on(QuestionnaireActions.setIsSurveyConfirmed, (state, action) => ({
    ...state,
    isSurveyConfirmed: action.isSurveyConfirmed,
  })),
)
