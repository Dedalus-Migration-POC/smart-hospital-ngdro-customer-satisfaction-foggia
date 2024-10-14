import {Injectable} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {catchError, concatMap, map, withLatestFrom} from 'rxjs/operators'
import {of} from 'rxjs'
import {SurveyService} from "../../repository/survey-service";
import {SurveyActions} from "./actions";
import {Store} from "@ngrx/store";
import {CreateSurveyRequest} from "../../repository/dto/create-survey-request";
import {SurveyAdminState} from "../store";
import {selectSurveyList} from "./reducer";

@Injectable()
export class SurveyEffects {
  constructor(
    private store: Store<SurveyAdminState>,
    private actions$: Actions,
    private surveyService: SurveyService,
  ) {
  }

  protected readonly fetchSurveys$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.fetchSurveys),
      concatMap(() =>
        this.surveyService.getSurveyList().pipe(
          map((surveys) => SurveyActions.fetchSurveysSucceeded({surveys})),
          catchError(() =>
            of(SurveyActions.fetchSurveysFailed()),
          ),
        ),
      ),
    )
  })

  protected readonly fetchSurveyById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.fetchSurveyById),
      concatMap(({surveyId}) =>
        this.surveyService.getSurveyById(surveyId).pipe(
          map((survey) => SurveyActions.fetchSurveyByIdSucceeded({survey})),
          catchError(() =>
            of(SurveyActions.fetchSurveyByIdFailed()),
          ),
        ),
      ),
    )
  })

  protected readonly submitSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.submitSurvey),
      concatMap(({surveyForm}) => {
          if (!surveyForm.sections) {
            throw new Error("Cannot submit surveyForm because section list is not valid: " + surveyForm.sections)
          }
          const survey: CreateSurveyRequest = {
            id: surveyForm.id ? Number(surveyForm.id) : undefined,
            name: surveyForm.name!,
            description: surveyForm.description ?? undefined,
            startDate: surveyForm.startDate!,
            endDate: surveyForm.endDate ?? undefined,
            sections: surveyForm.sections,
          }
          const api = !survey.id
            ? this.surveyService.createSurvey(survey)
            : this.surveyService.updateSurvey(survey)
          return api.pipe(
            map((survey) => SurveyActions.submitSurveySucceeded({survey})),
            catchError(() =>
              of(SurveyActions.submitSurveyFailed()),
            ),
          )
        },
      ),
    )
  })

  protected readonly deleteSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.deleteSurvey),
      withLatestFrom(this.store.select(selectSurveyList)),
      concatMap(([{surveyId}, {surveys}]) =>
        this.surveyService.deleteSurvey(surveyId).pipe(
          map(() => {
            const idx = surveys.findIndex(s => s.id!.toString() === surveyId)
            let updatedSurveys = Array.of(...surveys)
            updatedSurveys[idx] = {...updatedSurveys[idx], deleted: true}
            return SurveyActions.deleteSurveySucceeded({updatedSurveys})
          }),
          catchError(() =>
            of(SurveyActions.deleteSurveyFailed()),
          ),
        ),
      ),
    )
  })

  protected readonly restoreSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.restoreSurvey),
      withLatestFrom(this.store.select(selectSurveyList)),
      concatMap(([{surveyId}, {surveys}]) =>
        this.surveyService.restoreSurvey(surveyId).pipe(
          map(() => {
            const idx = surveys.findIndex(s => s.id!.toString() === surveyId)
            let updatedSurveys = Array.of(...surveys)
            updatedSurveys[idx] = {...updatedSurveys[idx], deleted: false}
            return SurveyActions.restoreSurveySucceeded({updatedSurveys})
          }),
          catchError(() =>
            of(SurveyActions.restoreSurveyFailed()),
          ),
        ),
      ),
    )
  })

  protected readonly publishSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.publishSurvey),
      withLatestFrom(this.store.select(selectSurveyList)),
      concatMap(([{surveyId}, {surveys}]) =>
        this.surveyService.publishSurvey(surveyId).pipe(
          map(() => {
            const idx = surveys.findIndex(s => s.id!.toString() === surveyId)
            let updatedSurveys = Array.of(...surveys)
            updatedSurveys[idx] = {...updatedSurveys[idx], status: 'ACTIVE'}
            return SurveyActions.publishSurveySucceeded({updatedSurveys})
          }),
          catchError(() =>
            of(SurveyActions.publishSurveyFailed()),
          ),
        ),
      ),
    )
  })

  protected readonly unpublishSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.unpublishSurvey),
      withLatestFrom(this.store.select(selectSurveyList)),
      concatMap(([{surveyId}, {surveys}]) =>
        this.surveyService.unpublishSurvey(surveyId).pipe(
          map(() => {
            const idx = surveys.findIndex(s => s.id!.toString() === surveyId)
            let updatedSurveys = Array.of(...surveys)
            updatedSurveys[idx] = {...updatedSurveys[idx], status: 'INACTIVE'}
            return SurveyActions.unpublishSurveySucceeded({updatedSurveys})
          }),
          catchError(() =>
            of(SurveyActions.unpublishSurveyFailed()),
          ),
        ),
      ),
    )
  })
}
