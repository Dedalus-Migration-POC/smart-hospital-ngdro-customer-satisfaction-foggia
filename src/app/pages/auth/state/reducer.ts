import { createReducer, on } from '@ngrx/store'
import * as QuestionnaireActions from './actions'
import { IQuestionnaire } from '../../questionnaire/state/service'

export const featureKey = 'authState'

export interface State {
  questionnaire: IQuestionnaire | null
  questionnaireLoading: boolean
  questionnaireError: boolean
}

export const initialState: State = {
  questionnaire: null,
  questionnaireLoading: false,
  questionnaireError: false,
}

export const reducer = createReducer(
  initialState,
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
