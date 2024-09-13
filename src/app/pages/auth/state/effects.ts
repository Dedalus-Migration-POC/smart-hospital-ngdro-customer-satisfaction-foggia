import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, concatMap } from 'rxjs/operators'
import { of } from 'rxjs'
import * as QuestionnaireActions from './actions'
import { QuestionnaireService } from './service'

@Injectable()
export class QuestionnaireEffects {
  fetchQuestionnaire$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuestionnaireActions.fetchQuestionnaire),
      concatMap((action) =>
        this.questionnaireService.fetchQuestionnaire(action.payload).pipe(
          map((data) =>
            QuestionnaireActions.fetchQuestionnaireSuccess({ data }),
          ),
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
  ) {}
}
