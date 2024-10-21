import {createFeatureSelector, createReducer, createSelector, on} from "@ngrx/store";
import {Survey, SurveyStatus} from "../../repository/dto/survey";
import {SubmitSurveyOption, SurveyActions} from "./actions";
import {AppActions} from "../application/actions";
import {SurveyAdminState} from "../store";

export enum SurveyOperatingStatus {
  DELETING_RESTORING = 'DELETING_RESTORING',
  PUBLISHING_UNPUBLISHING = 'PUBLISHING_UNPUBLISHING',
  CREATING = 'CREATING',
  CREATING_PUBLISHING = 'CREATING_PUBLISHING',
  CLONING = 'CLONING',
}

export type State = {
  fetchingSurveys: boolean;
  fetchSurveysError: boolean;
  operatingStatus: {
    surveyId: number;
    status: SurveyOperatingStatus;
  } | null;
  surveys: Array<Survey>;
  versions: Set<number>;
  showDeleted: boolean;
}

const initialState: State = {
  fetchingSurveys: false,
  fetchSurveysError: false,
  operatingStatus: null,
  surveys: [],
  versions: new Set([1]),
  showDeleted: false,
}

export const reducer = createReducer(
  initialState,
  on(AppActions.initializeSucceeded, (state, action) => ({
    ...state,
    surveys: action.surveys,
    versions: new Set<number>(action.surveys.map(({version}) => version).filter(Boolean).sort((a, b) => a > b ? 1 : -1))
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
  on(SurveyActions.submitSurvey, (state, {submitOption}) => {
    const statuses: Record<SubmitSurveyOption, SurveyOperatingStatus> = {
      save: SurveyOperatingStatus.CREATING,
      publish: SurveyOperatingStatus.CREATING_PUBLISHING
    }
    return {
      ...state,
      operatingStatus: {
        surveyId: -1,
        status: statuses[submitOption],
      },
    }
  }),
  on(SurveyActions.submitSurveySucceeded, (state, action) => {
    if (state.surveys.some(s => s.id === action.survey.id)) {
      return {
        ...state,
        operatingStatus: null,
        surveys: [...state.surveys.filter(s => s.id !== action.survey.id), action.survey]
      }
    }
    return {
      ...state,
      operatingStatus: null,
      surveys: [...state.surveys, action.survey]
    }
  }),
  on(SurveyActions.submitSurveyFailed, (state) => ({
    ...state,
    operatingStatus: null,
  })),
  on(SurveyActions.cloneSurvey, (state, action) => ({
    ...state,
    operatingStatus: {
      surveyId: action.survey.id!,
      status: SurveyOperatingStatus.CLONING,
    },
  })),
  on(SurveyActions.cloneSurveySucceeded, (state, action) => ({
    ...state,
    surveys: state.surveys.map(survey =>
      survey.id === action.survey.id
        ? {...action.survey}
        : survey
    ),
    operatingStatus: null
  })),
  on(SurveyActions.cloneSurveyFailed, (state) => ({
    ...state,
    operatingStatus: null
  })),
  on(SurveyActions.deleteSurvey, (state, action) => ({
    ...state,
    operatingStatus: {
      surveyId: action.survey.id!,
      status: SurveyOperatingStatus.DELETING_RESTORING,
    },
  })),
  on(SurveyActions.deleteSurveySucceeded, (state, action) => ({
    ...state,
    surveys: state.surveys.map(survey =>
      survey.id === action.survey.id
        ? {...survey, deleted: true}
        : survey
    ),
    operatingStatus: null
  })),
  on(SurveyActions.deleteSurveyFailed, (state) => ({
    ...state,
    operatingStatus: null
  })),
  on(SurveyActions.restoreSurvey, (state, action) => ({
    ...state,
    operatingStatus: {
      surveyId: action.survey.id!,
      status: SurveyOperatingStatus.DELETING_RESTORING
    },
  })),
  on(SurveyActions.restoreSurveySucceeded, (state, action) => ({
    ...state,
    surveys: state.surveys.map(survey =>
      survey.id === action.survey.id
        ? {...survey, deleted: false}
        : survey
    ),
    operatingStatus: null
  })),
  on(SurveyActions.restoreSurveyFailed, (state) => ({
    ...state,
    operatingStatus: null
  })),
  on(SurveyActions.publishSurvey, (state, action) => ({
    ...state,
    operatingStatus: {
      surveyId: action.survey.id!,
      status: SurveyOperatingStatus.PUBLISHING_UNPUBLISHING
    },
  })),
  on(SurveyActions.publishSurveySucceeded, (state, action) => ({
    ...state,
    surveys: state.surveys.map(survey =>
      survey.id === action.survey.id
        ? {...survey, status: SurveyStatus.ACTIVE}
        : survey
    ),
    operatingStatus: null
  })),
  on(SurveyActions.publishSurveyFailed, (state) => ({
    ...state,
    operatingStatus: null
  })),
  on(SurveyActions.unpublishSurvey, (state, action) => ({
    ...state,
    operatingStatus: {
      surveyId: action.survey!.id!,
      status: SurveyOperatingStatus.PUBLISHING_UNPUBLISHING
    },
  })),
  on(SurveyActions.unpublishSurveySucceeded, (state, action) => ({
    ...state,
    surveys: state.surveys.map(survey =>
      survey.id === action.survey.id
        ? {...survey, status: SurveyStatus.INACTIVE}
        : survey
    ),
    operatingStatus: null
  })),
  on(SurveyActions.unpublishSurveyFailed, (state) => ({
    ...state,
    operatingStatus: null
  })),
  on(SurveyActions.toggleShowDeleted, (state) => ({
    ...state,
    showDeleted: !state.showDeleted
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

export const selectSurveyVersions = createSelector((state: SurveyAdminState) => state.survey, ({versions}) => versions)
