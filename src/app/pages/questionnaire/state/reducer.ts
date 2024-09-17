import { createReducer, on } from '@ngrx/store'
import * as QuestionnaireActions from './actions'

export const featureKey = 'questState'

export interface State {
  questionnaire: any[]
}

export const initialState: State = {
  questionnaire: [],
}

export const reducer = createReducer(
  initialState,
  on(QuestionnaireActions.setQuestionnaire, (state, action) => ({
    ...state,
    questionnaire: state.questionnaire
      .filter((item) => item.id !== action.payload.id)
      .concat(action.payload),
  })),
)
