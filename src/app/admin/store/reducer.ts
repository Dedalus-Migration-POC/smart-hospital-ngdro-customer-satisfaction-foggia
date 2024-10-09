import {createReducer, createSelector, on} from "@ngrx/store";
import {Survey} from "../repository/dto/survey";
import {SurveyActions} from "./actions";
import {Section} from "../repository/dto/section";

type SurveyState = {
  fetchingSurveys: boolean
  fetchSurveysError: boolean
  surveys: Array<Survey>
  fetchingSections: boolean
  fetchSectionsError: boolean
  sections: Array<Section>
}

const initialState: SurveyState = {
  fetchingSurveys: false,
  fetchSurveysError: false,
  surveys: [],
  fetchingSections: false,
  fetchSectionsError: false,
  sections: []
}

export const reducer = createReducer(
  initialState,
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
  on(SurveyActions.fetchSectionsFailed, (state) => ({
    ...state,
    fetchingSections: false,
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
