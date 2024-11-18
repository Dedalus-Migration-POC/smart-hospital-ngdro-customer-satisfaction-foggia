import {createFeatureSelector, createReducer, createSelector, on} from "@ngrx/store";
import {Survey, SurveyStatus} from "../../repository/dto/survey";
import {SubmitSurveyOption, SurveyActions} from "./actions";
import {SurveyAdminState} from "../store";
import {FormControl, FormGroup} from "@angular/forms";
import {TablePagination} from "../../support/domain/table-pagination";
import {PagedList} from "../../repository/dto/paged_list";

export type SurveyFilterForm = FormGroup<{
  name: FormControl<string | null>;
  status: FormControl<SurveyStatus | null>;
  version: FormControl<number | null>;
  startDate: FormControl<Date | null>
  endDate: FormControl<Date | null>
}>

export enum SurveyOperatingStatus {
  DELETING_RESTORING = 'DELETING_RESTORING',
  PUBLISHING_UNPUBLISHING = 'PUBLISHING_UNPUBLISHING',
  CREATING = 'CREATING',
  CREATING_PUBLISHING = 'CREATING_PUBLISHING',
  CLONING = 'CLONING',
  PRINTING = 'PRINTING',
}

export type State = {
  fetchingSurveys: boolean;
  fetchSurveysError: boolean;
  operatingStatus: {
    surveyId: number;
    status: SurveyOperatingStatus;
  } | null;
  surveys: PagedList<Survey> | null;
  versions: Set<number>;
  showDeleted: boolean;
  searchCriteria: {
    filter: SurveyFilterForm['value'];
    tablePagination: TablePagination | undefined;
  },
  fetchingPrintData: boolean;
}

const initialState: State = {
  fetchingSurveys: false,
  fetchSurveysError: false,
  operatingStatus: null,
  surveys: null,
  versions: new Set([1]),
  showDeleted: false,
  searchCriteria: {
    filter: {},
    tablePagination: {
      size: 5,
      sort: 'name,asc'
    }
  },
  fetchingPrintData: false,
}

export const reducer = createReducer(
  initialState,
  on(SurveyActions.fetchSurveys, (state, {form, tablePagination}) => ({
    ...state,
    fetchingSurveys: true,
    fetchSurveysError: false,
    searchCriteria: {
      filter: {...state.searchCriteria.filter, ...form},
      tablePagination: {...state.searchCriteria.tablePagination, ...tablePagination},
    }
  })),
  on(SurveyActions.fetchSurveysSucceeded, (state, action) => ({
    ...state,
    fetchingSurveys: false,
    fetchSurveysError: false,
    surveys: action.surveys,
    versions: new Set<number>(action.surveys.content.map(({version}) => version).filter(Boolean).sort((a, b) => a > b ? 1 : -1))
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
    surveys: {
      ...state.surveys!,
      content: state.surveys!.content.map(s => s.id === action.survey.id ? action.survey : s)
    }
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
  on(SurveyActions.submitSurveySucceeded, (state, action) => ({
    ...state,
    creatingSection: false,
    operatingStatus: null,
    surveys: {
      ...state.surveys!,
      content: [action.survey, ...state.surveys!.content]
    }
  })),
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
    surveys: {
      ...state.surveys!,
      content: [action.survey, ...state.surveys!.content]
    },
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
  //FIXME se ruolo != admin rimuovere dall'array
  on(SurveyActions.deleteSurveySucceeded, (state, action) => ({
    ...state,
    surveys: {
      ...state.surveys!,
      content: state.surveys!.content.map(survey =>
        survey.id === action.survey.id
          ? {...survey, deleted: true}
          : survey
      )
    },
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
    surveys: {
      ...state.surveys!,
      content: state.surveys!.content.map(survey =>
        survey.id === action.survey.id
          ? {...survey, deleted: false}
          : survey
      )
    },
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
    surveys: {
      ...state.surveys!,
      content: state.surveys!.content.map(survey =>
        survey.id === action.survey.id
          ? {...survey, status: SurveyStatus.ACTIVE}
          : survey
      )
    },
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
    surveys: {
      ...state.surveys!,
      content: state.surveys!.content.map(survey =>
        survey.id === action.survey.id
          ? {...survey, status: SurveyStatus.INACTIVE}
          : survey
      )
    },
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
  on(SurveyActions.fetchPrintSurveyData, (state) => ({
    ...state,
    fetchingPrintData: true
  })),
  on(SurveyActions.fetchPrintSurveyDataSucceeded, (state) => ({
    ...state,
    fetchingPrintData: false
  })),
  on(SurveyActions.fetchPrintSurveyDataFailed, (state) => ({
    ...state,
    fetchingPrintData: false
  })),
  on(SurveyActions.printSurvey, (state) => ({
    ...state,
    operatingStatus: {
      surveyId: -1,
      status: SurveyOperatingStatus.PRINTING,
    },
  })),
  on(SurveyActions.printSurveySucceeded, (state) => ({
    ...state,
    operatingStatus: null,
  })),
  on(SurveyActions.printSurveyFailed, (state) => ({
    ...state,
    operatingStatus: null,
  })),
)

export const selectSurveyState = createFeatureSelector<State>('survey');
export const selectSectionSearchCriteria = createSelector((state: SurveyAdminState) => state.survey, (({
                                                                                                         searchCriteria
                                                                                                       }) => searchCriteria))
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
