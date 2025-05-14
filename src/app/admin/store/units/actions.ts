import { createAction, props } from '@ngrx/store'
import {
  HealthcareUnit,
  StructureType,
} from '../../repository/dto/healthcare-unit'

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

export const fetchStructureTypes = createAction(
  '[UnitsList] fetch Structure Types',
)
export const fetchStructureTypesSuccess = createAction(
  '[UnitsList] fetch Structure Types Success',
  props<{ structureTypes: StructureType[] }>(),
)
export const fetchStructureTypesFailure = createAction(
  '[UnitsList] fetch Structure Types Failure',
)

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
  fetchStructureTypes,
  fetchStructureTypesSuccess,
  fetchStructureTypesFailure,
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
  | typeof fetchStructureTypes
  | typeof fetchStructureTypesSuccess
  | typeof fetchStructureTypesFailure
