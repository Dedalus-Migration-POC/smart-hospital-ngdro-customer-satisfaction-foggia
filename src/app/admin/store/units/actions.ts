import { createAction, props } from '@ngrx/store'
import { SectionForm } from '../../pages/section-form/section-form.component'
import { TablePagination } from '../../support/domain/table-pagination'
import { UnitsListFilterForm } from './reducer'
import { PagedList } from '../../repository/dto/paged_list'
import { HealthcareUnit } from '../../repository/dto/healthcare-unit'

const fetchUnitsList = createAction('[UnitsList] Fetch UnitsList')

const fetchUnitsListSucceeded = createAction(
  '[UnitsList] Fetch UnitsList Succeeded',
  props<{ response: HealthcareUnit[] }>(),
)

const fetchUnitsListFailed = createAction('[UnitsList] Fetch UnitsList Failed')

// const submitUnit = createAction(
//   '[UnitsList] Submit UnitsList',
//   props<{ unitForm: UnitForm['value'] }>(),
// )

// const submitUnitSucceeded = createAction(
//   '[UnitsList] Submit Unit Succeeded',
//   props<{ unit: HealthcareUnit }>(),
// )

// const submitUnitFailed = createAction('[UnitsList] Submit Unit Failed')

// const deleteUnit = createAction(
//   '[UnitsList] Delete Unit',
//   props<{ unit: HealthcareUnit }>(),
// )

// const deleteUnitSucceeded = createAction(
//   '[UnitsList] Delete Unit Succeeded',
//   props<{ unit: HealthcareUnit }>(),
// )

// const deleteUnitFailed = createAction('[UnitsList] Delete Unit Failed')

export const UnitsListActions = {
  fetchUnitsList,
  fetchUnitsListSucceeded,
  fetchUnitsListFailed,
  // submitUnit,
  // submitUnitSucceeded,
  // submitUnitFailed,
  // deleteUnit,
  // deleteUnitSucceeded,
  // deleteUnitFailed,
}

export type UnitsListActionTypes =
  | typeof fetchUnitsList
  | typeof fetchUnitsListSucceeded
  | typeof fetchUnitsListFailed
// | typeof submitUnit
// | typeof submitUnitSucceeded
// | typeof submitUnitFailed
// | typeof deleteUnit
// | typeof deleteUnitSucceeded
// | typeof deleteUnitFailed
