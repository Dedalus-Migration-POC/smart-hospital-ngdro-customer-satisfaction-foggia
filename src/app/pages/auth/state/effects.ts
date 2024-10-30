import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, concatMap } from 'rxjs/operators'
import { of } from 'rxjs'
import * as QuestionnaireActions from './actions'
import { QuestionnaireService } from './service'
import { Router } from '@angular/router'
import { SmartHospitalState } from 'src/app/store/reducers'
import { Store } from '@ngrx/store'
import { fetchQuestionnaire } from './actions'
import { ItNotificationService, NotificationPosition } from 'design-angular-kit'
import { TranslateService } from '@ngx-translate/core'

@Injectable()
export class AuthEffects {
  sendOtp$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuestionnaireActions.sendOtp),
      concatMap((action) =>
        this.questionnaireService.sendOtp(action.otp, action.payload).pipe(
          map(() => {
            this.router.navigate([`/questionnaire/${action.payload.surveyId}`])

            return QuestionnaireActions.sendOtpSuccess()
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('attention'),
              this.translate.instant('quest.send-quest-error'),
              true,
              8000,
              NotificationPosition.Top,
            )
            return of(QuestionnaireActions.sendOtpFailure({ error }))
          }),
        ),
      ),
    )
  })

  fetchQuestionnaire$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuestionnaireActions.fetchQuestionnaire),
      concatMap((action) =>
        this.questionnaireService.fetchQuestionnaire(action.surveyId).pipe(
          map((data) => {
            return QuestionnaireActions.fetchQuestionnaireSuccess({ data })
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('attention'),
              this.translate.instant('quest.send-quest-error'),
              true,
              8000,
              NotificationPosition.Top,
            )
            return of(QuestionnaireActions.fetchQuestionnaireFailure({ error }))
          }),
        ),
      ),
    )
  })

  getHealthcareUnit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuestionnaireActions.getHealthcareUnit),
      concatMap((action) =>
        this.questionnaireService
          .getHealthcareUnit(action.healthcareUnitId)
          .pipe(
            map((data) => {
              return QuestionnaireActions.getHealthcareUnitSuccess({ data })
            }),
            catchError((error) => {
              return of(
                QuestionnaireActions.getHealthcareUnitFailure({ error }),
              )
            }),
          ),
      ),
    )
  })

  constructor(
    private actions$: Actions,
    private questionnaireService: QuestionnaireService,
    private router: Router,
    private store: Store<SmartHospitalState>,
    private readonly notificationService: ItNotificationService,
    private translate: TranslateService,
  ) {}
}
