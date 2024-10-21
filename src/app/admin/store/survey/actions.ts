import {createAction, props} from '@ngrx/store'
import {Survey} from "../../repository/dto/survey";
import {SurveyForm} from "../../pages/survey-form/survey-form.component";
import {PrintSurveyForm} from "../../pages/survey-list/print-survey-dialog/print-survey-dialog.component";
import {SurveyFilterForm} from "../../pages/survey-list/survey-list-table/filter/filter.component";

export type SubmitSurveyOption = 'save' | 'publish'

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
  props<{ surveyId: string, version: string }>()
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
  props<{ surveyForm: SurveyForm['value'], submitOption: SubmitSurveyOption }>()
)

const submitSurveySucceeded = createAction(
  '[Survey] Submit Survey Succeeded',
  props<{ survey: Survey }>()
)

const submitSurveyFailed = createAction(
  '[Survey] Submit Survey Failed',
)

const cloneSurvey = createAction(
  '[Survey] Clone Survey',
  props<{ survey: Survey }>()
)

const cloneSurveySucceeded = createAction(
  '[Survey] Clone Survey Succeeded',
  props<{ survey: Survey }>()
)

const cloneSurveyFailed = createAction(
  '[Survey] Clone Survey Failed',
)

const deleteSurvey = createAction(
  '[Survey] Delete Survey',
  props<{ survey: Survey }>()
)

const deleteSurveySucceeded = createAction(
  '[Survey] Delete Survey Succeeded',
  props<{ survey: Survey }>()
)

const deleteSurveyFailed = createAction(
  '[Survey] Delete Survey Failed',
  props<{ survey: Survey }>()
)

const restoreSurvey = createAction(
  '[Survey] Restore Survey',
  props<{ survey: Survey }>()
)

const restoreSurveySucceeded = createAction(
  '[Survey] Restore Survey Succeeded',
  props<{ survey: Survey }>()
)

const restoreSurveyFailed = createAction(
  '[Survey] Restore Survey Failed',
  props<{ survey: Survey }>()
)

const publishSurvey = createAction(
  '[Survey] Publish Survey',
  props<{ survey: Survey }>()
)

const publishSurveySucceeded = createAction(
  '[Survey] Publish Survey Succeeded',
  props<{ survey: Survey }>()
)

const publishSurveyFailed = createAction(
  '[Survey] Publish Survey Failed',
)

const unpublishSurvey = createAction(
  '[Survey] Unpublish Survey',
  props<{ survey: Survey }>()
)

const unpublishSurveySucceeded = createAction(
  '[Survey] Unpublish Survey Succeeded',
  props<{ survey: Survey }>()
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

const toggleShowDeleted = createAction(
  '[Survey] Toggle Show Deleted',
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
  cloneSurvey,
  cloneSurveySucceeded,
  cloneSurveyFailed,
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
  toggleShowDeleted,
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
  | typeof cloneSurvey
  | typeof cloneSurveySucceeded
  | typeof cloneSurveyFailed
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
  | typeof toggleShowDeleted
