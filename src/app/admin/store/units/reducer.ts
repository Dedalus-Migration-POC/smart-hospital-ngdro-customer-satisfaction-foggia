import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store'
import { UnitsListActions } from './actions'
import { SurveyAdminState } from '../store'
import { TablePagination } from '../../support/domain/table-pagination'
import { FormControl, FormGroup } from '@angular/forms'
import { PagedList } from '../../repository/dto/paged_list'
import { HealthcareUnit } from '../../repository/dto/healthcare-unit'

export type State = {
  fetchUnitsListLoading: boolean
  fetchUnitsListError: boolean
  unitsList: HealthcareUnit[] | null
  unitLoading: boolean
}

const initialState: State = {
  fetchUnitsListLoading: false,
  fetchUnitsListError: false,
  unitsList: null,
  unitLoading: false,
}

export const reducer = createReducer(
  initialState,

  on(UnitsListActions.fetchUnitsList, (state) => ({
    ...state,
    fetchUnitsListLoading: true,
    fetchUnitsListError: false,
  })),
  on(UnitsListActions.fetchUnitsListSucceeded, (state, action) => ({
    ...state,
    fetchUnitsListLoading: false,
    fetchUnitsListError: false,
    unitsList: action.response,
  })),
  on(UnitsListActions.fetchUnitsListFailed, (state) => ({
    ...state,
    fetchUnitsListLoading: false,
    fetchUnitsListError: true,
  })),

  on(UnitsListActions.createUnit, (state) => ({
    ...state,
    unitLoading: true,
  })),
  on(UnitsListActions.createUnitSucceeded, (state, action) => ({
    ...state,
    unitLoading: false,
  })),
  on(UnitsListActions.createUnitFailed, (state) => ({
    ...state,
    unitLoading: false,
  })),

  on(UnitsListActions.deleteUnit, (state, action) => ({
    ...state,
    unitLoading: true,
  })),
  on(UnitsListActions.deleteUnitSucceeded, (state) => ({
    ...state,
    unitLoading: false,
  })),
  on(UnitsListActions.deleteUnitFailed, (state) => ({
    ...state,
    unitLoading: false,
  })),
)

export const selectUnitsListState = createFeatureSelector<State>('unitsList')

export const selectUnitsList = createSelector(
  (state: SurveyAdminState) => state.unitsList,
  ({ unitsList }) => unitsList,
)
export const selectUnitsListLoading = createSelector(
  (state: SurveyAdminState) => state.unitsList,
  ({ fetchUnitsListLoading }) => fetchUnitsListLoading,
)
export const selectUnitsListError = createSelector(
  (state: SurveyAdminState) => state.unitsList,
  ({ fetchUnitsListError }) => fetchUnitsListError,
)
