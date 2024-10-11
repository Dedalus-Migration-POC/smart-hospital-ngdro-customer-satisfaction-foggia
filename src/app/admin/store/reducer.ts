import {createReducer, createSelector, on} from "@ngrx/store";
import {Survey} from "../repository/dto/survey";
import {SurveyActions} from "./actions";
import {Section} from "../repository/dto/section";

type SurveyState = {
  initializing: boolean
  initializeError: boolean
  fetchingSurveys: boolean
  fetchSurveysError: boolean
  creatingSurvey: boolean
  editingSurveyId: string | null
  surveys: Array<Survey>
  fetchingSections: boolean
  fetchSectionsError: boolean
  sections: Array<Section>
  creatingSection: boolean
  editingSectionId: string | null
}

const initialState: SurveyState = {
  initializing: false,
  initializeError: false,
  fetchingSurveys: false,
  fetchSurveysError: false,
  creatingSurvey: false,
  editingSurveyId: null,
  surveys: [],
  fetchingSections: false,
  fetchSectionsError: false,
  sections: [],
  creatingSection: false,
  editingSectionId: null
}

export const reducer = createReducer(
  initialState,
  on(SurveyActions.initialize, (state) => ({
    ...state,
    initializing: true,
    initializeError: false,
  })),
  on(SurveyActions.initializeSucceeded, (state, action) => ({
    ...state,
    initializing: false,
    initializeError: false,
    surveys: action.surveys,
    sections: action.sections,
  })),
  on(SurveyActions.initializeFailed, (state) => ({
    ...state,
    initializing: false,
    initializeError: true,
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
  on(SurveyActions.submitSurveySucceeded, (state, action) => ({
    ...state,
    creatingSurvey: false,
    surveys: [...state.surveys, action.survey]
  })),
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
    sections: action.updatedSurveys,
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
    sections: action.updatedSurveys,
    editingSurveyId: null
  })),
  on(SurveyActions.restoreSurveyFailed, (state) => ({
    ...state,
    editingSurveyId: null
  })),
  on(SurveyActions.fetchSections, (state) => ({
    ...state,
    fetchingSections: true,
    fetchSectionsError: false,
  })),
  on(SurveyActions.fetchSectionsSucceeded, (state, action) => ({
    ...state,
    fetchingSections: false,
    fetchSectionsError: false,
    sections: action.sections
  })),
  on(SurveyActions.fetchSectionsFailed, (state) => ({
    ...state,
    fetchingSections: false,
    fetchSectionsError: true,
  })),
  on(SurveyActions.fetchSectionById, (state) => ({
    ...state,
    fetchingSections: true,
  })),
  on(SurveyActions.fetchSectionByIdSucceeded, (state, action) => ({
    ...state,
    fetchingSections: false,
    sections: [...state.sections, action.section]
  })),
  on(SurveyActions.fetchSectionByIdFailed, (state) => ({
    ...state,
    fetchingSections: false,
  })),
  on(SurveyActions.submitSection, (state) => ({
    ...state,
    creatingSection: true,
  })),
  on(SurveyActions.submitSectionSucceeded, (state, action) => ({
    ...state,
    creatingSection: false,
    sections: [...state.sections, action.section]
  })),
  on(SurveyActions.submitSectionFailed, (state) => ({
    ...state,
    creatingSection: false,
  })),
  on(SurveyActions.deleteSection, (state, action) => ({
    ...state,
    editingSectionId: action.sectionId,
  })),
  on(SurveyActions.deleteSectionSucceeded, (state, action) => ({
    ...state,
    sections: action.updatedSections,
    editingSectionId: null
  })),
  on(SurveyActions.deleteSectionFailed, (state) => ({
    ...state,
    editingSectionId: null
  })),
  on(SurveyActions.restoreSection, (state, action) => ({
    ...state,
    editingSectionId: action.sectionId,
  })),
  on(SurveyActions.restoreSectionSucceeded, (state, action) => ({
    ...state,
    sections: action.updatedSections,
    editingSectionId: null
  })),
  on(SurveyActions.restoreSectionFailed, (state) => ({
    ...state,
    editingSectionId: null
  })),
)

export type SurveyAdminState = { survey: SurveyState }
export const selectSurveyState = (state: SurveyAdminState) => state.survey;
export const selectSurveyList = createSelector(selectSurveyState, ({
                                                                     fetchingSurveys,
                                                                     fetchSurveysError,
                                                                     surveys
                                                                   }) => ({
  fetchingSurveys,
  fetchSurveysError,
  surveys
}))
export const selectSectionList = createSelector(selectSurveyState, ({
                                                                      fetchingSections,
                                                                      fetchSectionsError,
                                                                      sections
                                                                    }) => ({
  fetchingSections,
  fetchSectionsError,
  sections
}))
