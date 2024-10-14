import {createAction, props} from '@ngrx/store'
import {Survey} from "../../repository/dto/survey";
import {SurveyForm} from "../../pages/survey-form/survey-form.component";

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
