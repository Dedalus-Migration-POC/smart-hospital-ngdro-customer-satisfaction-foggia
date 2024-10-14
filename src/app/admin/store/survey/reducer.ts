import {createFeatureSelector, createReducer, createSelector, on} from "@ngrx/store";
import {Survey} from "../../repository/dto/survey";
import {SurveyActions} from "./actions";
import {AppActions} from "../application/actions";
import {SurveyAdminState} from "../store";

export type State = {
  fetchingSurveys: boolean
  fetchSurveysError: boolean
  creatingSurvey: boolean
  editingSurveyId: string | null
  surveys: Array<Survey>
}

const initialState: State = {
  fetchingSurveys: false,
  fetchSurveysError: false,
  creatingSurvey: false,
  editingSurveyId: null,
  surveys: [],
}

export const reducer = createReducer(
  initialState,
  on(AppActions.initializeSucceeded, (state, action) => ({
    ...state,
    surveys: action.surveys,
  })),
  on(SurveyActions.fetchSurveys, (state) => ({
    ...state,
    fetchingSurveys: true,
    fetchSurveysError: false,
  })),
  on(SurveyActions.fetchSurveysSucceeded, (state, action) => ({
    ...state,
    fetchingSurveys: false,
    fetchSurveysError: false,
    surveys: action.surveys,
  })),
  on(SurveyActions.fetchSurveysFailed, (state) => ({
    ...state,
    fetchingSurveys: false,
    fetchSurveysError: true,
  })),
  on(SurveyActions.fetchSurveyById, (state) => ({
    ...state,
    fetchingSurveys: true,
  })),
  on(SurveyActions.fetchSurveyByIdSucceeded, (state, action) => ({
    ...state,
    fetchingSurveys: false,
    surveys: [...state.surveys, action.survey]
  })),
  on(SurveyActions.fetchSurveyByIdFailed, (state) => ({
    ...state,
    fetchingSurveys: false,
  })),
  on(SurveyActions.submitSurvey, (state) => ({
    ...state,
    creatingSurvey: true,
  })),
  on(SurveyActions.submitSurveySucceeded, (state, action) => {
    if (state.surveys.some(s => s.id === action.survey.id)) {
      return {
        ...state,
        creatingSurvey: false,
        surveys: [...state.surveys.filter(s => s.id !== action.survey.id), action.survey]
      }
    }
    return {
      ...state,
      creatingSurvey: false,
      surveys: [...state.surveys, action.survey]
    }
  }),
  on(SurveyActions.submitSurveyFailed, (state) => ({
    ...state,
    creatingSurvey: false,
  })),
  on(SurveyActions.deleteSurvey, (state, action) => ({
    ...state,
    editingSurveyId: action.surveyId,
  })),
  on(SurveyActions.deleteSurveySucceeded, (state, action) => ({
    ...state,
    surveys: action.updatedSurveys,
    editingSurveyId: null
  })),
  on(SurveyActions.deleteSurveyFailed, (state) => ({
    ...state,
    editingSurveyId: null
  })),
  on(SurveyActions.restoreSurvey, (state, action) => ({
    ...state,
    editingSurveyId: action.surveyId,
  })),
  on(SurveyActions.restoreSurveySucceeded, (state, action) => ({
    ...state,
    surveys: action.updatedSurveys,
    editingSurveyId: null
  })),
  on(SurveyActions.restoreSurveyFailed, (state) => ({
    ...state,
    editingSurveyId: null
  })),
  on(SurveyActions.publishSurvey, (state, action) => ({
    ...state,
    editingSurveyId: action.surveyId,
  })),
  on(SurveyActions.publishSurveySucceeded, (state, action) => ({
    ...state,
    surveys: action.updatedSurveys,
    editingSurveyId: null
  })),
  on(SurveyActions.publishSurveyFailed, (state) => ({
    ...state,
    editingSurveyId: null
  })),
)

export const selectSurveyState = createFeatureSelector<State>('survey');
export const selectSurveyList = createSelector((state: SurveyAdminState) => state.survey, ({
                                                                                             fetchingSurveys,
                                                                                             fetchSurveysError,
                                                                                             surveys,
                                                                                           }) => ({
  fetchingSurveys,
  fetchSurveysError,
  surveys,
}))
