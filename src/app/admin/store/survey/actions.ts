import {createAction, props} from '@ngrx/store'
import {Survey} from "../../repository/dto/survey";
import {SurveyForm} from "../../pages/survey-form/survey-form.component";
import {PrintSurveyForm} from "../../pages/survey-list/print-survey-dialog/print-survey-dialog.component";
import {SurveyFilterForm} from "../../pages/survey-list/survey-list-table/filter/filter.component";

const fetchSurveys = createAction(
  '[Survey] Fetch Surveys',
  props<{ form: SurveyFilterForm['value'] }>(),
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

const deleteSurvey = createAction(
  '[Survey] Delete Survey',
  props<{ surveyId: string }>()
)

const deleteSurveySucceeded = createAction(
  '[Survey] Delete Survey Succeeded',
  props<{ updatedSurveys: Array<Survey> }>()
)

const deleteSurveyFailed = createAction(
  '[Survey] Delete Survey Failed',
  props<{ survey: Survey }>()
)

const restoreSurvey = createAction(
  '[Survey] Restore Survey',
  props<{ surveyId: string }>()
)

const restoreSurveySucceeded = createAction(
  '[Survey] Restore Survey Succeeded',
  props<{ updatedSurveys: Array<Survey> }>()
)

const restoreSurveyFailed = createAction(
  '[Survey] Restore Survey Failed',
  props<{ survey: Survey }>()
)

const publishSurvey = createAction(
  '[Survey] Publish Survey',
  props<{ surveyId: string }>()
)

const publishSurveySucceeded = createAction(
  '[Survey] Publish Survey Succeeded',
  props<{ updatedSurveys: Array<Survey> }>()
)

const publishSurveyFailed = createAction(
  '[Survey] Publish Survey Failed',
)

const unpublishSurvey = createAction(
  '[Survey] Unpublish Survey',
  props<{ surveyId: string }>()
)

const unpublishSurveySucceeded = createAction(
  '[Survey] Unpublish Survey Succeeded',
  props<{ updatedSurveys: Array<Survey> }>()
)

const unpublishSurveyFailed = createAction(
  '[Survey] Unpublish Survey Failed',
)

const printSurvey = createAction(
  '[Survey] Print Survey',
  props<{ printSurveyForm: PrintSurveyForm['value'] }>()
)

const printSurveySucceeded = createAction(
  '[Survey] Print Survey Succeeded',
)

const printSurveyFailed = createAction(
  '[Survey] Print Survey Failed',
)

export const SurveyActions = {
  fetchSurveys,
  fetchSurveysSucceeded,
  fetchSurveysFailed,
  fetchSurveyById,
  fetchSurveyByIdSucceeded,
  fetchSurveyByIdFailed,
  submitSurvey,
  submitSurveySucceeded,
  submitSurveyFailed,
  deleteSurvey,
  deleteSurveySucceeded,
  deleteSurveyFailed,
  restoreSurvey,
  restoreSurveySucceeded,
  restoreSurveyFailed,
  publishSurvey,
  publishSurveySucceeded,
  publishSurveyFailed,
  unpublishSurvey,
  unpublishSurveySucceeded,
  unpublishSurveyFailed,
  printSurvey,
  printSurveySucceeded,
  printSurveyFailed,
}

export type SurveyActionTypes =
  | typeof fetchSurveys
  | typeof fetchSurveysSucceeded
  | typeof fetchSurveysFailed
  | typeof fetchSurveyById
  | typeof fetchSurveyByIdSucceeded
  | typeof fetchSurveyByIdFailed
  | typeof submitSurvey
  | typeof submitSurveySucceeded
  | typeof submitSurveyFailed
  | typeof deleteSurvey
  | typeof deleteSurveySucceeded
  | typeof deleteSurveyFailed
  | typeof restoreSurvey
  | typeof restoreSurveySucceeded
  | typeof restoreSurveyFailed
  | typeof publishSurvey
  | typeof publishSurveySucceeded
  | typeof publishSurveyFailed
  | typeof unpublishSurvey
  | typeof unpublishSurveySucceeded
  | typeof unpublishSurveyFailed
  | typeof printSurvey
  | typeof printSurveySucceeded
  | typeof printSurveyFailed
