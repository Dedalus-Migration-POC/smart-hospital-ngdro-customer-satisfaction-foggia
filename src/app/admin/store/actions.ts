import {createAction, props} from '@ngrx/store'
import {Survey} from "../repository/dto/survey";
import {Section} from "../repository/dto/section";
import {SectionForm} from "../pages/section-form/section-form.component";
import {SurveyForm} from "../pages/survey-form/survey-form.component";

const initialize = createAction(
  '[Survey] Initialize',
)

const initializeSucceeded = createAction(
  '[Survey] Initialize Succeeded',
  props<{ surveys: Array<Survey>, sections: Array<Section> }>(),
)

const initializeFailed = createAction(
  '[Survey] Initialize Failed',
)

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

const fetchSurveyById = createAction(
  '[Survey] Fetch Survey by ID',
  props<{ surveyId: string }>()
)

const fetchSurveyByIdSucceeded = createAction(
  '[Survey] Fetch Survey by ID Succeeded',
  props<{ survey: Survey }>()
)

const fetchSurveyByIdFailed = createAction(
  '[Survey] Fetch Survey by ID Failed',
)

const submitSurvey = createAction(
  '[Survey] Submit Survey',
  props<{ surveyForm: SurveyForm['value'] }>()
)

const submitSurveySucceeded = createAction(
  '[Survey] Submit Survey Succeeded',
  props<{ survey: Survey }>()
)

const submitSurveyFailed = createAction(
  '[Survey] Submit Survey Failed',
)

const fetchSections = createAction(
  '[Survey] Fetch Sections',
)

const fetchSectionsSucceeded = createAction(
  '[Survey] Fetch Sections Succeeded',
  props<{ sections: Array<Section> }>(),
)

const fetchSectionsFailed = createAction(
  '[Survey] Fetch Sections Failed',
)

const fetchSectionById = createAction(
  '[Survey] Fetch Section by ID',
  props<{ sectionId: string }>()
)

const fetchSectionByIdSucceeded = createAction(
  '[Survey] Fetch Section by ID Succeeded',
  props<{ section: Section }>()
)

const fetchSectionByIdFailed = createAction(
  '[Survey] Fetch Section by ID Failed',
)

const submitSection = createAction(
  '[Survey] Submit Section',
  props<{ sectionForm: SectionForm['value'] }>()
)

const submitSectionSucceeded = createAction(
  '[Survey] Submit Section Succeeded',
  props<{ section: Section }>()
)

const submitSectionFailed = createAction(
  '[Survey] Submit Section Failed',
)

const deleteSection = createAction(
  '[Survey] Delete Section',
  props<{ sectionId: string }>()
)

const deleteSectionSucceeded = createAction(
  '[Survey] Delete Section Succeeded',
  props<{ updatedSections: Array<Section> }>()
)

const deleteSectionFailed = createAction(
  '[Survey] Delete Section Failed',
)

const restoreSection = createAction(
  '[Survey] Restore Section',
  props<{ sectionId: string }>()
)

const restoreSectionSucceeded = createAction(
  '[Survey] Restore Section Succeeded',
  props<{ updatedSections: Array<Section> }>()
)

const restoreSectionFailed = createAction(
  '[Survey] Restore Section Failed',
)

export const SurveyActions = {
  initialize,
  initializeSucceeded,
  initializeFailed,
  fetchSurveys,
  fetchSurveysSucceeded,
  fetchSurveysFailed,
  fetchSurveyById,
  fetchSurveyByIdSucceeded,
  fetchSurveyByIdFailed,
  submitSurvey,
  submitSurveySucceeded,
  submitSurveyFailed,
  fetchSections,
  fetchSectionsSucceeded,
  fetchSectionsFailed,
  fetchSectionById,
  fetchSectionByIdSucceeded,
  fetchSectionByIdFailed,
  submitSection,
  submitSectionSucceeded,
  submitSectionFailed,
  deleteSection,
  deleteSectionSucceeded,
  deleteSectionFailed,
  restoreSection,
  restoreSectionSucceeded,
  restoreSectionFailed,
}

export type SurveyActionTypes =
  typeof initialize
  | typeof initializeSucceeded
  | typeof initializeFailed
  | typeof fetchSurveys
  | typeof fetchSurveysSucceeded
  | typeof fetchSurveysFailed
  | typeof fetchSurveyById
  | typeof fetchSurveyByIdSucceeded
  | typeof fetchSurveyByIdFailed
  | typeof submitSurvey
  | typeof submitSurveySucceeded
  | typeof submitSurveyFailed
  | typeof fetchSections
  | typeof fetchSectionsSucceeded
  | typeof fetchSectionsFailed
  | typeof fetchSectionById
  | typeof fetchSectionByIdSucceeded
  | typeof fetchSectionByIdFailed
  | typeof submitSection
  | typeof submitSectionSucceeded
  | typeof submitSectionFailed
  | typeof deleteSection
  | typeof deleteSectionSucceeded
  | typeof deleteSectionFailed
  | typeof restoreSection
  | typeof restoreSectionSucceeded
  | typeof restoreSectionFailed
