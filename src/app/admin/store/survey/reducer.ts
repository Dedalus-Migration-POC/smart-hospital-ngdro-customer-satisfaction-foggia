import {createFeatureSelector, createReducer, createSelector, on} from "@ngrx/store";
import {Survey} from "../../repository/dto/survey";
import {SurveyActions} from "./actions";
import {AppActions} from "../application/actions";
import {SurveyAdminState} from "../store";

export enum SurveyOperatingStatus {
  DELETING_RESTORING = 'DELETING_RESTORING',
  PUBLISHING_UNPUBLISHING = 'PUBLISHING_UNPUBLISHING'
}

export type State = {
  fetchingSurveys: boolean;
  fetchSurveysError: boolean;
  creatingSurvey: boolean;
  operatingStatus: {
    surveyId: string;
    status: SurveyOperatingStatus;
  } | null
  surveys: Array<Survey>;
}

const initialState: State = {
  fetchingSurveys: false,
  fetchSurveysError: false,
  creatingSurvey: false,
  operatingStatus: null,
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
    operatingStatus: {
      surveyId: action.surveyId,
      status: SurveyOperatingStatus.DELETING_RESTORING,
    },
  })),
  on(SurveyActions.deleteSurveySucceeded, (state, action) => ({
    ...state,
    surveys: action.updatedSurveys,
    operatingStatus: null
  })),
  on(SurveyActions.deleteSurveyFailed, (state) => ({
    ...state,
    operatingStatus: null
  })),
  on(SurveyActions.restoreSurvey, (state, action) => ({
    ...state,
    operatingStatus: {
      surveyId: action.surveyId,
      status: SurveyOperatingStatus.DELETING_RESTORING
    },
  })),
  on(SurveyActions.restoreSurveySucceeded, (state, action) => ({
    ...state,
    surveys: action.updatedSurveys,
    operatingStatus: null
  })),
  on(SurveyActions.restoreSurveyFailed, (state) => ({
    ...state,
    operatingStatus: null
  })),
  on(SurveyActions.publishSurvey, (state, action) => ({
    ...state,
    operatingStatus: {
      surveyId: action.surveyId,
      status: SurveyOperatingStatus.PUBLISHING_UNPUBLISHING
    },
  })),
  on(SurveyActions.publishSurveySucceeded, (state, action) => ({
    ...state,
    surveys: action.updatedSurveys,
    operatingStatus: null
  })),
  on(SurveyActions.publishSurveyFailed, (state) => ({
    ...state,
    operatingStatus: null
  })),
  on(SurveyActions.unpublishSurvey, (state, action) => ({
    ...state,
    operatingStatus: {
      surveyId: action.surveyId,
      status: SurveyOperatingStatus.PUBLISHING_UNPUBLISHING
    },
  })),
  on(SurveyActions.unpublishSurveySucceeded, (state, action) => ({
    ...state,
    surveys: action.updatedSurveys,
    operatingStatus: null
  })),
  on(SurveyActions.unpublishSurveyFailed, (state) => ({
    ...state,
    operatingStatus: null
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
