import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, concatMap } from 'rxjs/operators'
import { of } from 'rxjs'
import * as QuestionnaireActions from './actions'
import { QuestionnaireService } from './service'
import { Router } from '@angular/router'

@Injectable()
export class AuthEffects {
  fetchQuestionnaire$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuestionnaireActions.fetchQuestionnaire),
      concatMap((action) =>
        this.questionnaireService.fetchQuestionnaire(action.payload).pipe(
          map((data) => {
            this.router.navigate(['/questionnaire'])
            return QuestionnaireActions.fetchQuestionnaireSuccess({ data })
          }),
          catchError((error) =>
            of(QuestionnaireActions.fetchQuestionnaireFailure({ error })),
          ),
        ),
      ),
    )
  })

  constructor(
    private actions$: Actions,
    private questionnaireService: QuestionnaireService,
    private router: Router,
  ) {}
}
