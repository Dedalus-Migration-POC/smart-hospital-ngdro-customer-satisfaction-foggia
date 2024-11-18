import {Injectable} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {catchError, concatMap, filter, map, switchMap, withLatestFrom} from 'rxjs/operators'
import {of} from 'rxjs'
import {SurveyService} from "../../repository/survey-service";
import {SurveyActions} from "./actions";
import {Store} from "@ngrx/store";
import {SurveyPersistRequest} from "../../repository/dto/survey-persist-request";
import {SurveyAdminState} from "../store";
import {selectSectionSearchCriteria} from "./reducer";
import {SurveyStatus} from "../../repository/dto/survey";
import {SurveyForm} from "../../pages/survey-form/survey-form.component";

const surveyFormToPersistRequest = (surveyForm: SurveyForm['value']): SurveyPersistRequest => ({
  id: surveyForm.id ? Number(surveyForm.id) : undefined,
  name: surveyForm.name!,
  description: surveyForm.description ?? undefined,
  version: surveyForm.version!,
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
      withLatestFrom(this.store.select(selectSectionSearchCriteria)),
      switchMap(([_, {filter, tablePagination}]) => this.surveyService.find({
          name: filter.name ?? undefined,
          status: filter.status ?? undefined,
          version: filter.version ?? undefined,
          dateRange: {startDate: filter.startDate ?? undefined, endDate: filter.endDate ?? undefined}
        }, tablePagination).pipe(
          map((surveys) => SurveyActions.fetchSurveysSucceeded({surveys})),
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
      filter(({submitOption}) => submitOption === 'publish'),
      switchMap(({surveyForm}) => {
          const request = surveyFormToPersistRequest(surveyForm)
          const api = !request.id
            ? this.surveyService.create(request)
            : this.surveyService.update(request)
          return api.pipe(
            concatMap((survey) =>
              this.surveyService.publish(survey.id!.toString()).pipe(
                map(() => SurveyActions.submitSurveySucceeded({survey: {...survey, status: SurveyStatus.ACTIVE}})),
                catchError(() => of(SurveyActions.submitSurveySucceeded({survey}))),
              )
            ),
            catchError(() => of(SurveyActions.submitSurveyFailed())),
          )
        },
      ),
    )
  })

  private readonly saveAndPublishSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.submitSurvey),
      filter(({submitOption}) => submitOption === 'save'),
      switchMap(({surveyForm}) => {
        const request = surveyFormToPersistRequest(surveyForm)
        const api = !request.id ? this.surveyService.create(request) : this.surveyService.update(request)
        return api.pipe(
          map((survey) => SurveyActions.submitSurveySucceeded({survey: {...survey, status: SurveyStatus.ACTIVE}})),
          catchError(() => of(SurveyActions.submitSurveyFailed())),
        )
      }),
    )
  })

  private readonly cloneSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.cloneSurvey),
      concatMap(({survey}) =>
        this.surveyService.clone(survey.id!.toString()).pipe(
          map((survey) => SurveyActions.cloneSurveySucceeded({survey})),
          catchError(() =>
            of(SurveyActions.cloneSurveyFailed()),
          ),
        ),
      ),
    )
  })

  private readonly deleteSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.deleteSurvey),
      concatMap(({survey}) =>
        this.surveyService.delete(survey.id!.toString()).pipe(
          map(() => SurveyActions.deleteSurveySucceeded({survey})),
          catchError(() => of(SurveyActions.deleteSurveyFailed({survey}))),
        ),
      ),
    )
  })

  private readonly restoreSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.restoreSurvey),
      switchMap(({survey}) =>
        this.surveyService.restore(survey.id!.toString()).pipe(
          map(() => SurveyActions.restoreSurveySucceeded({survey})),
          catchError(() => of(SurveyActions.restoreSurveyFailed({survey}))),
        ),
      ),
    )
  })

  private readonly publishSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.publishSurvey),
      switchMap(({survey}) =>
        this.surveyService.publish(survey.id!.toString()).pipe(
          map(() => SurveyActions.publishSurveySucceeded({survey})),
          catchError(() => of(SurveyActions.publishSurveyFailed())),),
      ),
    )
  })

  private readonly unpublishSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.unpublishSurvey),
      switchMap(({survey}) =>
        this.surveyService.unpublish(survey.id!.toString()).pipe(
          map(() => SurveyActions.unpublishSurveySucceeded({survey})),
          catchError(() => of(SurveyActions.unpublishSurveyFailed()))
        ),
      ),
    )
  })

  private readonly printSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.printSurvey),
      switchMap(({printSurveyForm}) => this.surveyService.print({
          surveyId: printSurveyForm.survey!.id!,
          healthcareUnitId: printSurveyForm.healthcareUnit!.id,
          structure: printSurveyForm.structure!,
          copies: printSurveyForm.copies!,
        }).pipe(
          map((document) => SurveyActions.printSurveySucceeded({document})),
          catchError(() => of(SurveyActions.printSurveyFailed())),
        )
      ),
    )
  })
}
