import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, concatMap } from 'rxjs/operators'
import { of } from 'rxjs'
import * as QuestionnaireActions from './actions'
import { QuestionnaireService } from './service'
import { Router } from '@angular/router'
import { ItNotificationService, NotificationPosition } from 'design-angular-kit'
import { TranslateService } from '@ngx-translate/core'
import { Store } from '@ngrx/store'
import { SmartHospitalState } from 'src/app/store/reducers'
import { setIsSurveyConfirmed } from './actions'

@Injectable()
export class QuestionnaireEffects {
  sendQuestionnaire$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuestionnaireActions.sendQuestionnaire),
      concatMap((action) =>
        this.questionnaireService.sendQuestionnaire(action.payload).pipe(
          map((data) => {
            this.store.dispatch(
              setIsSurveyConfirmed({ isSurveyConfirmed: true }),
            )

            return QuestionnaireActions.sendQuestionnaireSuccess({ data })
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('attention'),
              this.translate.instant('quest.send-quest-error'),
              true,
              8000,
              NotificationPosition.Top,
            )
            return of(QuestionnaireActions.sendQuestionnaireFailure({ error }))
          }),
        ),
      ),
    )
  })

  constructor(
    private actions$: Actions,
    private questionnaireService: QuestionnaireService,
    private store: Store<SmartHospitalState>,
    private readonly notificationService: ItNotificationService,
    private translate: TranslateService,
  ) {}
}
