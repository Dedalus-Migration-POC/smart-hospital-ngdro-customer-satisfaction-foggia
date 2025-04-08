import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, concatMap, map } from 'rxjs/operators'
import { of, tap } from 'rxjs'
import { UnitsListActions } from './actions'
import { Store } from '@ngrx/store'
import { SurveyAdminState } from '../store'
import { HealthcareUnitService } from '../../repository/healthcare-unit-service'

@Injectable()
export class UnitListEffects {
  constructor(
    private store: Store<SurveyAdminState>,
    private actions$: Actions,
    private healthcareUnitService: HealthcareUnitService,
  ) {}

  fetchUnitsList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UnitsListActions.fetchUnitsList),
      concatMap(() =>
        this.healthcareUnitService.find().pipe(
          map((data) => {
            return UnitsListActions.fetchUnitsListSucceeded({ response: data })
          }),
          catchError((error) => {
            return of(UnitsListActions.fetchUnitsListFailed())
          }),
        ),
      ),
    )
  })

  // private readonly submitSection$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(UnitsListActions.submitSection),
  //     concatMap(({ sectionForm }) => {
  //       if (!sectionForm.questions) {
  //         throw new Error(
  //           'Cannot submit sectionForm because question list is not valid: ' +
  //             sectionForm.questions,
  //         )
  //       }
  //       const section: CreateSectionRequest = {
  //         id: sectionForm.id ? Number(sectionForm.id) : undefined,
  //         name: sectionForm.name!,
  //         description: sectionForm.description ?? undefined,
  //         version: sectionForm.version!,
  //         questions: sectionForm.questions.map((q) => ({
  //           answerType: 'RATE',
  //           name: q!,
  //         })),
  //       }
  //       const api = !section.id
  //         ? this.sectionService.create(section)
  //         : this.sectionService.update(section)
  //       return api.pipe(
  //         map((section) =>
  //           UnitsListActions.submitSectionSucceeded({ section }),
  //         ),
  //         catchError(() => of(UnitsListActions.submitSectionFailed())),
  //       )
  //     }),
  //   )
  // })

  // private readonly deleteSection$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(UnitsListActions.deleteSection),
  //     concatMap(({ section }) =>
  //       this.sectionService.delete(section.id!.toString()).pipe(
  //         map(() => UnitsListActions.deleteSectionSucceeded({ section })),
  //         catchError(() => of(UnitsListActions.deleteSectionFailed())),
  //       ),
  //     ),
  //   )
  // })
}
