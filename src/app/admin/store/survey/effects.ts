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
import {SurveyStatus} from "../../repository/dto/survey";

@Injectable()
export class SurveyEffects {
  constructor(
    private store: Store<SurveyAdminState>,
    private actions$: Actions,
    private surveyService: SurveyService,
  ) {
  }

  private readonly fetchSurveys$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.fetchSurveys),
      concatMap(({form}) => this.surveyService.find({
          name: form.name ?? undefined,
          status: form.status ?? undefined,
          version: form.version ?? undefined,
          dateRange: {startDate: form.startDate ?? undefined, endDate: form.endDate ?? undefined}
        }).pipe(
          map((response) => SurveyActions.fetchSurveysSucceeded({surveys: response.content})),
          catchError(() =>
            of(SurveyActions.fetchSurveysFailed()),
          ),
        ),
      ),
    )
  })

  private readonly fetchSurveyById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.fetchSurveyById),
      concatMap(({surveyId}) =>
        this.surveyService.findById(surveyId).pipe(
          map((survey) => SurveyActions.fetchSurveyByIdSucceeded({survey})),
          catchError(() =>
            of(SurveyActions.fetchSurveyByIdFailed()),
          ),
        ),
      ),
    )
  })

  private readonly submitSurvey$ = createEffect(() => {
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
            dateRange: {
              startDate: surveyForm.startDate!,
              endDate: surveyForm.endDate ?? undefined,
            },
            sections: surveyForm.sections,
          }
          const api = !survey.id
            ? this.surveyService.create(survey)
            : this.surveyService.update(survey)
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

  private readonly deleteSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.deleteSurvey),
      withLatestFrom(this.store.select(selectSurveyList)),
      concatMap(([{surveyId}, {surveys}]) =>
        this.surveyService.delete(surveyId).pipe(
          map(() => {
            const idx = surveys.findIndex(s => s.id!.toString() === surveyId)
            let updatedSurveys = Array.of(...surveys)
            updatedSurveys[idx] = {...updatedSurveys[idx], deleted: true}
            return SurveyActions.deleteSurveySucceeded({updatedSurveys})
          }),
          catchError(() =>
            of(SurveyActions.deleteSurveyFailed({
              survey: surveys.find(s => s.id!.toString() === surveyId)!
            })),
          ),
        ),
      ),
    )
  })

  private readonly restoreSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.restoreSurvey),
      withLatestFrom(this.store.select(selectSurveyList)),
      concatMap(([{surveyId}, {surveys}]) =>
        this.surveyService.restore(surveyId).pipe(
          map(() => {
            const idx = surveys.findIndex(s => s.id!.toString() === surveyId)
            let updatedSurveys = Array.from(surveys)
            updatedSurveys[idx] = {...updatedSurveys[idx], deleted: false}
            return SurveyActions.restoreSurveySucceeded({updatedSurveys})
          }),
          catchError(() =>
            of(SurveyActions.restoreSurveyFailed({
              survey: surveys.find(s => s.id!.toString() === surveyId)!
            })),
          ),
        ),
      ),
    )
  })

  private readonly publishSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.publishSurvey),
      withLatestFrom(this.store.select(selectSurveyList)),
      concatMap(([{surveyId}, {surveys}]) =>
        this.surveyService.publish(surveyId).pipe(
          map(() => {
            const idx = surveys.findIndex(s => s.id!.toString() === surveyId)
            let updatedSurveys = Array.from(surveys)
            updatedSurveys[idx] = {...updatedSurveys[idx], status: SurveyStatus.ACTIVE}
            return SurveyActions.publishSurveySucceeded({updatedSurveys})
          }),
          catchError(() =>
            of(SurveyActions.publishSurveyFailed()),
          ),
        ),
      ),
    )
  })

  private readonly unpublishSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.unpublishSurvey),
      withLatestFrom(this.store.select(selectSurveyList)),
      concatMap(([{surveyId}, {surveys}]) =>
        this.surveyService.unpublish(surveyId).pipe(
          map(() => {
            const idx = surveys.findIndex(s => s.id!.toString() === surveyId)
            let updatedSurveys = Array.of(...surveys)
            updatedSurveys[idx] = {...updatedSurveys[idx], status: SurveyStatus.INACTIVE}
            return SurveyActions.unpublishSurveySucceeded({updatedSurveys})
          }),
          catchError(() =>
            of(SurveyActions.unpublishSurveyFailed()),
          ),
        ),
      ),
    )
  })

  private readonly printSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.printSurvey),
      withLatestFrom(this.store.select(selectSurveyList)),
      concatMap(([{printSurveyForm}, {surveys}]) => {
          console.log(printSurveyForm)
          return this.surveyService.print().pipe(
            map(() => SurveyActions.printSurveySucceeded()),
            catchError(() =>
              of(SurveyActions.printSurveyFailed()),
            ),
          )
        }
      ),
    )
  })
}
