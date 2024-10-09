import {createAction, props} from '@ngrx/store'
import {Survey} from "../repository/dto/survey";
import {Section} from "../repository/dto/section";

const fetchSurveys = createAction(
  '[Survey] Fetch Surveys',
)

const fetchSurveysSucceeded = createAction(
  '[Survey] Fetch Surveys Succeeded',
  props<{ surveys: Array<Survey> }>(),
)

const fetchSurveysFailed = createAction(
  '[Survey] Fetch Surveys Failed',
)

const fetchSections = createAction(
  '[Sections Fetch Sections',
)

const fetchSectionsSucceeded = createAction(
  '[Sections Fetch Sections Succeeded',
  props<{ sections: Array<Section> }>(),
)

const fetchSectionsFailed = createAction(
  '[Sections Fetch Sections Failed',
)

const fetchSectionById = createAction(
  '[Sections Fetch Section by ID',
  props<{ sectionId: string }>()
)

const fetchSectionByIdSucceeded = createAction(
  '[Sections Fetch Section by ID Succeeded',
  props<{ section: Section }>()
)

const fetchSectionByIdFailed = createAction(
  '[Sections Fetch Section by ID Failed',
)

export const SurveyActions = {
  fetchSurveys,
  fetchSurveysSucceeded,
  fetchSurveysFailed,
  fetchSections,
  fetchSectionsSucceeded,
  fetchSectionsFailed,
  fetchSectionById,
  fetchSectionByIdSucceeded,
  fetchSectionByIdFailed,
}

export type SurveyActionTypes =
  typeof fetchSurveys
  | typeof fetchSurveysSucceeded
  | typeof fetchSurveysFailed
  | typeof fetchSections
  | typeof fetchSectionsSucceeded
  | typeof fetchSectionsFailed
  | typeof fetchSectionById
  | typeof fetchSectionByIdSucceeded
  | typeof fetchSectionByIdFailed
