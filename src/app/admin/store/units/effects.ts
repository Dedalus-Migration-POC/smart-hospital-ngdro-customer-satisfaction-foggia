import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, concatMap, map } from 'rxjs/operators'
import { of, tap } from 'rxjs'
import { UnitsListActions } from './actions'
import { Store } from '@ngrx/store'
import { SurveyAdminState } from '../store'
import { HealthcareUnitService } from '../../repository/healthcare-unit-service'
import { DialogService } from '../../support/dialog-service'

@Injectable()
export class UnitListEffects {
  constructor(
    private store: Store<SurveyAdminState>,
    private actions$: Actions,
    private healthcareUnitService: HealthcareUnitService,
    private dialog: DialogService,
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

  createUnit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UnitsListActions.createUnit),
      concatMap((action) =>
        this.healthcareUnitService.create(action.unit).pipe(
          map((data) => {
            this.store.dispatch(UnitsListActions.fetchUnitsList())
            return UnitsListActions.createUnitSucceeded()
          }),
          catchError((error) => {
            this.dialog.error({
              buttonsType: 'ok',
            })
            return of(UnitsListActions.createUnitFailed())
          }),
        ),
      ),
    )
  })

  deleteUnit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UnitsListActions.deleteUnit),
      concatMap((action) =>
        this.healthcareUnitService.delete(action.id).pipe(
          map((data) => {
            this.store.dispatch(UnitsListActions.fetchUnitsList())
            return UnitsListActions.deleteUnitSucceeded()
          }),
          catchError((error) => {
            this.dialog.error({
              buttonsType: 'ok',
            })
            return of(UnitsListActions.deleteUnitFailed())
          }),
        ),
      ),
    )
  })
}
