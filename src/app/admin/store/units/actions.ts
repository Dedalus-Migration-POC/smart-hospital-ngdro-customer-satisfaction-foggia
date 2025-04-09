import { createAction, props } from '@ngrx/store'
import { HealthcareUnit } from '../../repository/dto/healthcare-unit'

const fetchUnitsList = createAction('[UnitsList] Fetch UnitsList')

const fetchUnitsListSucceeded = createAction(
  '[UnitsList] Fetch UnitsList Succeeded',
  props<{ response: HealthcareUnit[] }>(),
)

const fetchUnitsListFailed = createAction('[UnitsList] Fetch UnitsList Failed')

const createUnit = createAction(
  '[UnitsList] Create Unit',
  props<{ unit: any }>(),
)

const createUnitSucceeded = createAction('[UnitsList] Create Unit Succeeded')

const createUnitFailed = createAction('[UnitsList] Create Unit Failed')

const deleteUnit = createAction(
  '[UnitsList] Delete Unit',
  props<{ id: number }>(),
)

const deleteUnitSucceeded = createAction('[UnitsList] Delete Unit Succeeded')

const deleteUnitFailed = createAction('[UnitsList] Delete Unit Failed')

export const UnitsListActions = {
  fetchUnitsList,
  fetchUnitsListSucceeded,
  fetchUnitsListFailed,
  createUnit,
  createUnitSucceeded,
  createUnitFailed,
  deleteUnit,
  deleteUnitSucceeded,
  deleteUnitFailed,
}

export type UnitsListActionTypes =
  | typeof fetchUnitsList
  | typeof fetchUnitsListSucceeded
  | typeof fetchUnitsListFailed
  | typeof createUnit
  | typeof createUnitSucceeded
  | typeof createUnitFailed
  | typeof deleteUnit
  | typeof deleteUnitSucceeded
  | typeof deleteUnitFailed
