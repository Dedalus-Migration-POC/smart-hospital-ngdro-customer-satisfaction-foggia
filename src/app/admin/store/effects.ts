import {Injectable} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {catchError, concatMap, map} from 'rxjs/operators'
import {of} from 'rxjs'
import {SurveyService} from "../repository/SurveyService";
import {SurveyActions} from "./actions";

@Injectable()
export class SurveyEffects {
  constructor(
    private actions$: Actions,
    private surveyService: SurveyService,
  ) {
  }

  fetchSurveys$ = createEffect(() => {
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

  fetchSections$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.fetchSections),
      concatMap(() =>
        this.surveyService.getSectionList().pipe(
          map((sections) => SurveyActions.fetchSectionsSucceeded({sections})),
          catchError(() =>
            of(SurveyActions.fetchSectionsFailed()),
          ),
        ),
      ),
    )
  })

  fetchSectionById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.fetchSectionById),
      concatMap(({sectionId}) =>
        this.surveyService.getSectionById(sectionId).pipe(
          map((section) => SurveyActions.fetchSectionByIdSucceeded({section})),
          catchError(() =>
            of(SurveyActions.fetchSectionByIdFailed()),
          ),
        ),
      ),
    )
  })
}
