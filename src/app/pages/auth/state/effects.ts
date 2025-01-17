import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, concatMap } from 'rxjs/operators'
import { of } from 'rxjs'
import * as QuestionnaireActions from './actions'
import { AuthService } from './service'
import { Router } from '@angular/router'
import { SmartHospitalState } from 'src/app/store/reducers'
import { Store } from '@ngrx/store'
import { ItNotificationService, NotificationPosition } from 'design-angular-kit'
import { TranslateService } from '@ngx-translate/core'

@Injectable()
export class AuthEffects {
  sendOtp$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuestionnaireActions.sendOtp),
      concatMap((action) =>
        this.authService.sendOtp(action.otp, action.age).pipe(
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
        this.authService.fetchQuestionnaire(action.surveyId).pipe(
          map((data) => {
            return QuestionnaireActions.fetchQuestionnaireSuccess({ data })
          }),
          catchError((error) => {
            let errorType
            if (error && error.status === 404) {
              errorType = 'notFound'
            } else if (
              error &&
              error.status === 500 &&
              error.error.errorMessage.includes('expired')
            ) {
              errorType = 'expired'
            } else if (
              error &&
              error.status === 400 &&
              error.error.errorMessage.includes('completed')
            ) {
              errorType = 'compiled'
            } else {
              errorType = 'notFound'
              this.notificationService.error(
                this.translate.instant('attention'),
                this.translate.instant('quest.send-quest-error'),
                true,
                8000,
                NotificationPosition.Top,
              )
            }

            return of(
              QuestionnaireActions.fetchQuestionnaireFailure({
                error: { ...error, type: errorType },
              }),
            )
          }),
        ),
      ),
    )
  })

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private store: Store<SmartHospitalState>,
    private readonly notificationService: ItNotificationService,
    private translate: TranslateService,
  ) {}
}
