import { createAction, props } from '@ngrx/store'
import { Survey } from '../../repository/dto/survey'
import { SurveyForm } from '../../pages/survey-form/survey-form.component'
import { PagedList } from '../../repository/dto/paged_list'
import { TablePagination } from '../../support/domain/table-pagination'
import { SurveyFilterForm } from './reducer'
import { PrintDataResponse } from '../../repository/dto/print-data-response'
import { PrintSurveyForm } from '../../components/print-survey/print-survey.component'

export type SubmitSurveyOption = 'save' | 'publish'

const fetchAllSurveys = createAction(
  '[Survey] Fetch All Surveys',
  props<{
    form?: SurveyFilterForm['value']
    tablePagination?: Partial<TablePagination>
  }>(),
)
const fetchAllSurveysSucceeded = createAction(
  '[Survey] Fetch All Surveys Succeeded',
  props<{ allSurveys: PagedList<Survey> }>(),
)
const fetchAllSurveysFailed = createAction('[Survey] Fetch All Surveys Failed')

const fetchSurveys = createAction(
  '[Survey] Fetch Surveys',
  props<{
    form?: SurveyFilterForm['value']
    tablePagination?: Partial<TablePagination>
  }>(),
)

const fetchSurveysSucceeded = createAction(
  '[Survey] Fetch Surveys Succeeded',
  props<{ surveys: PagedList<Survey> }>(),
)

const fetchSurveysFailed = createAction('[Survey] Fetch Surveys Failed')

const fetchSurveyById = createAction(
  '[Survey] Fetch Survey by ID',
  props<{ surveyId: string; version: string }>(),
)

const fetchSurveyByIdSucceeded = createAction(
  '[Survey] Fetch Survey by ID Succeeded',
  props<{ survey: Survey }>(),
)

const fetchSurveyByIdFailed = createAction('[Survey] Fetch Survey by ID Failed')

const submitSurvey = createAction(
  '[Survey] Submit Survey',
  props<{
    surveyForm: SurveyForm['value']
    submitOption: SubmitSurveyOption
  }>(),
)

const submitSurveySucceeded = createAction(
  '[Survey] Submit Survey Succeeded',
  props<{ survey: Survey }>(),
)

const submitSurveyFailed = createAction('[Survey] Submit Survey Failed')

const cloneSurvey = createAction(
  '[Survey] Clone Survey',
  props<{ survey: Survey }>(),
)

const cloneSurveySucceeded = createAction(
  '[Survey] Clone Survey Succeeded',
  props<{ survey: Survey }>(),
)

const cloneSurveyFailed = createAction('[Survey] Clone Survey Failed')

const deleteSurvey = createAction(
  '[Survey] Delete Survey',
  props<{ survey: Survey }>(),
)

const deleteSurveySucceeded = createAction(
  '[Survey] Delete Survey Succeeded',
  props<{ survey: Survey }>(),
)

const deleteSurveyFailed = createAction(
  '[Survey] Delete Survey Failed',
  props<{ survey: Survey }>(),
)

const restoreSurvey = createAction(
  '[Survey] Restore Survey',
  props<{ survey: Survey }>(),
)

const restoreSurveySucceeded = createAction(
  '[Survey] Restore Survey Succeeded',
  props<{ survey: Survey }>(),
)

const restoreSurveyFailed = createAction(
  '[Survey] Restore Survey Failed',
  props<{ survey: Survey }>(),
)

const publishSurvey = createAction(
  '[Survey] Publish Survey',
  props<{ survey: Survey }>(),
)

const publishSurveySucceeded = createAction(
  '[Survey] Publish Survey Succeeded',
  props<{ survey: Survey }>(),
)

const publishSurveyFailed = createAction('[Survey] Publish Survey Failed')

const unpublishSurvey = createAction(
  '[Survey] Unpublish Survey',
  props<{ survey: Survey }>(),
)

const unpublishSurveySucceeded = createAction(
  '[Survey] Unpublish Survey Succeeded',
  props<{ survey: Survey }>(),
)

const unpublishSurveyFailed = createAction('[Survey] Unpublish Survey Failed')

const fetchPrintSurveyData = createAction('[Survey] Fetch Print Survey data')

const fetchPrintSurveyDataSucceeded = createAction(
  '[Survey] Fetch Print Survey Succeeded data',
  props<{ data: PrintDataResponse }>(),
)

const fetchPrintSurveyDataFailed = createAction(
  '[Survey] Fetch Print Survey Failed data',
  props<{ error?: string }>(),
)

const printSurvey = createAction(
  '[Survey] Print Survey',
  props<{ printSurveyForm: PrintSurveyForm['value'] }>(),
)

const printSurveySucceeded = createAction(
  '[Survey] Print Survey Succeeded',
  props<{ document: Blob }>(),
)

const printSurveyFailed = createAction('[Survey] Print Survey Failed')

const toggleShowDeleted = createAction('[Survey] Toggle Show Deleted')

export const SurveyActions = {
  fetchAllSurveys,
  fetchAllSurveysSucceeded,
  fetchAllSurveysFailed,
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
  fetchPrintSurveyData,
  fetchPrintSurveyDataSucceeded,
  fetchPrintSurveyDataFailed,
  printSurvey,
  printSurveySucceeded,
  printSurveyFailed,
  toggleShowDeleted,
}

export type SurveyActionTypes =
  | typeof fetchAllSurveys
  | typeof fetchAllSurveysSucceeded
  | typeof fetchAllSurveysFailed
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
  | typeof fetchPrintSurveyData
  | typeof fetchPrintSurveyDataSucceeded
  | typeof fetchPrintSurveyDataFailed
  | typeof printSurvey
  | typeof printSurveySucceeded
  | typeof printSurveyFailed
  | typeof toggleShowDeleted
