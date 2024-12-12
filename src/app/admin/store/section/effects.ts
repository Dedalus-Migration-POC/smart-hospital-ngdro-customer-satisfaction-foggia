import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import {
  catchError,
  concatMap,
  filter,
  map,
  withLatestFrom,
} from 'rxjs/operators'
import { of, tap } from 'rxjs'
import { SectionActions } from './actions'
import { CreateSectionRequest } from '../../repository/dto/create-section-request'
import { SectionService } from '../../repository/section-service'
import { Store } from '@ngrx/store'
import { SurveyAdminState } from '../store'
import { selectSectionSearchCriteria } from './reducer'
import { SurveyActions } from '../survey/actions'

@Injectable()
export class SectionEffects {
  constructor(
    private store: Store<SurveyAdminState>,
    private actions$: Actions,
    private sectionService: SectionService,
  ) {}

  private readonly autoUpdate$ = this.actions$
    .pipe(
      filter((action) =>
        [
          SurveyActions.submitSurveySucceeded.type.toString(),
          SurveyActions.deleteSurveySucceeded.type.toString(),
          SurveyActions.cloneSurveySucceeded.type.toString(),
          SurveyActions.publishSurveySucceeded.type.toString(),
          SurveyActions.unpublishSurveySucceeded.type.toString(),
          SurveyActions.restartSurveySucceeded.type.toString(),
          SectionActions.cloneSectionSucceeded.type.toString(),
          SectionActions.deleteSectionSucceeded.type.toString(),
        ].includes(action.type),
      ),
      withLatestFrom(this.store),
      tap(([action, state]) => {
        this.store.dispatch(SectionActions.fetchSections({}))
        this.store.dispatch(SectionActions.fetchAllSections())
      }),
    )
    .subscribe()

  private readonly fetchAllSections$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionActions.fetchAllSections),
      concatMap(() =>
        this.sectionService.find({}, { size: 999, sort: 'name,asc' }).pipe(
          map((response) =>
            SectionActions.fetchAllSectionsSucceeded({ response }),
          ),
          catchError(() => of(SectionActions.fetchAllSectionsFailed())),
        ),
      ),
    )
  })

  private readonly fetchSections$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionActions.fetchSections),
      withLatestFrom(this.store.select(selectSectionSearchCriteria)),
      concatMap(([_, { filter, tablePagination }]) =>
        this.sectionService
          .find(
            {
              name: filter.name ?? undefined,
              version: filter.version ?? undefined,
              associatedSurveyIds: filter.presentIn
                ? [filter.presentIn]
                : undefined,
            },
            tablePagination,
          )
          .pipe(
            map((response) =>
              SectionActions.fetchSectionsSucceeded({ response }),
            ),
            catchError(() => of(SectionActions.fetchSectionsFailed())),
          ),
      ),
    )
  })

  private readonly fetchSectionById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionActions.fetchSectionById),
      concatMap(({ section }) =>
        this.sectionService.findById(section.id!.toString()).pipe(
          map((section) =>
            SectionActions.fetchSectionByIdSucceeded({ section }),
          ),
          catchError(() => of(SectionActions.fetchSectionByIdFailed())),
        ),
      ),
    )
  })

  private readonly submitSection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionActions.submitSection),
      concatMap(({ sectionForm }) => {
        if (!sectionForm.questions) {
          throw new Error(
            'Cannot submit sectionForm because question list is not valid: ' +
              sectionForm.questions,
          )
        }
        const section: CreateSectionRequest = {
          id: sectionForm.id ? Number(sectionForm.id) : undefined,
          name: sectionForm.name!,
          description: sectionForm.description ?? undefined,
          version: sectionForm.version!,
          questions: sectionForm.questions.map((q) => ({
            answerType: 'RATE',
            name: q!,
          })),
        }
        const api = !section.id
          ? this.sectionService.create(section)
          : this.sectionService.update(section)
        return api.pipe(
          map((section) => SectionActions.submitSectionSucceeded({ section })),
          catchError(() => of(SectionActions.submitSectionFailed())),
        )
      }),
    )
  })

  private readonly cloneSection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionActions.cloneSection),
      concatMap(({ section }) =>
        this.sectionService.clone(section.id!.toString()).pipe(
          map((section) => SectionActions.cloneSectionSucceeded({ section })),
          catchError(() => of(SectionActions.cloneSectionFailed())),
        ),
      ),
    )
  })

  private readonly deleteSection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionActions.deleteSection),
      concatMap(({ section }) =>
        this.sectionService.delete(section.id!.toString()).pipe(
          map(() => SectionActions.deleteSectionSucceeded({ section })),
          catchError(() => of(SectionActions.deleteSectionFailed())),
        ),
      ),
    )
  })

  private readonly restoreSection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionActions.restoreSection),
      concatMap(({ section }) =>
        this.sectionService.restore(section.id!.toString()).pipe(
          map(() => SectionActions.restoreSectionSucceeded({ section })),
          catchError(() => of(SectionActions.restoreSectionFailed())),
        ),
      ),
    )
  })
}
