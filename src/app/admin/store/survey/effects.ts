import {Injectable} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {catchError, concatMap, filter, map, switchMap, withLatestFrom} from 'rxjs/operators'
import {of} from 'rxjs'
import {SurveyService} from "../../repository/survey-service";
import {SurveyActions} from "./actions";
import {Store} from "@ngrx/store";
import {SurveyPersistRequest} from "../../repository/dto/survey-persist-request";
import {SurveyAdminState} from "../store";
import {selectSurveyList} from "./reducer";
import {SurveyStatus} from "../../repository/dto/survey";
import {SurveyForm} from "../../pages/survey-form/survey-form.component";

const buildCreateSurveyRequest = (surveyForm: SurveyForm['value']): SurveyPersistRequest => ({
  id: surveyForm.id ? Number(surveyForm.id) : undefined,
  name: surveyForm.name!,
  description: surveyForm.description ?? undefined,
  validityDates: {
    startDate: surveyForm.startDate!,
    endDate: surveyForm.endDate ?? undefined,
  },
  sectionIds: surveyForm.sections!.map(s => s!.id!),
})

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
      switchMap(({form}) => this.surveyService.find({
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
      switchMap(({surveyId}) =>
        this.surveyService.findById(surveyId).pipe(
          map((survey) => SurveyActions.fetchSurveyByIdSucceeded({survey})),
          catchError(() =>
            of(SurveyActions.fetchSurveyByIdFailed()),
          ),
        ),
      ),
    )
  })

  private readonly saveSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.submitSurvey),
      filter(({submitOption}) => submitOption === 'save'),
      switchMap(({surveyForm}) => {
          const request = buildCreateSurveyRequest(surveyForm)
          return !request.id
            ? this.surveyService.create(request)
            : this.surveyService.update(request)
        },
      ),
      map((survey) => SurveyActions.submitSurveySucceeded({survey})),
      catchError(() => of(SurveyActions.submitSurveyFailed())),
    )
  })

  private readonly saveAndPublishSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.submitSurvey),
      filter(({submitOption}) => submitOption === 'publish'),
      switchMap(({surveyForm}) => this.surveyService.create(buildCreateSurveyRequest(surveyForm))),
      switchMap((survey) => this.surveyService.publish(survey.id!.toString()).pipe(
        map(() => SurveyActions.submitSurveySucceeded({survey: {...survey, status: SurveyStatus.ACTIVE}}))
      )),
      catchError(() => of(SurveyActions.submitSurveyFailed())),
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
      switchMap(([{surveyId}, {surveys}]) =>
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
      switchMap(([{surveyId}, {surveys}]) =>
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
      switchMap(([{surveyId}, {surveys}]) =>
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
      switchMap(([{printSurveyForm}, {surveys}]) => {
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
