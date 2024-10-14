import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {SurveyService} from "../../repository/survey-service";
import {AppActions} from "./actions";
import {catchError, concatMap} from "rxjs/operators";
import {forkJoin, map, of} from "rxjs";


@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private surveyService: SurveyService,
  ) {
  }

  private readonly initialize$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppActions.initialize),
      concatMap(() =>
        forkJoin([
          this.surveyService.getSurveyList(),
          this.surveyService.getSectionList()
        ]).pipe(
          map(([surveys, sections]) =>
            AppActions.initializeSucceeded({surveys, sections})
          ),
          catchError(() =>
            of(AppActions.initializeFailed())
          )
        ),
      ),
    )
  })
}
