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

export type UnitsListFilterForm = FormGroup<{
  name: FormControl<string | null>
  haveQuestionary: FormControl<boolean>
}>

export type State = {
  fetchUnitsListLoading: boolean
  fetchUnitsListError: boolean
  unitsList: HealthcareUnit[] | null
}

const initialState: State = {
  fetchUnitsListLoading: false,
  fetchUnitsListError: false,
  unitsList: null,
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

  // on(UnitsListActions.submitUnit, (state) => ({
  //   ...state,
  //   creatingSection: true,
  // })),
  // on(UnitsListActions.submitUnitSucceeded, (state, action) => ({
  //   ...state,
  //   creatingSection: false,
  //   sections: {
  //     ...state.sections!,
  //     content: [action.section, ...state.sections!.content],
  //   },
  // })),
  // on(UnitsListActions.submitUnitFailed, (state) => ({
  //   ...state,
  //   creatingSection: false,
  // })),

  // on(UnitsListActions.deleteUnit, (state, action) => ({
  //   ...state,
  //   editingSectionId: action.section.id!,
  // })),
  // on(UnitsListActions.deleteUnitSucceeded, (state, action) => ({
  //   ...state,
  //   sections: {
  //     ...state.sections!,
  //     content: state.sections!.content.map((section) =>
  //       section.id === action.section.id
  //         ? { ...section, deleted: true }
  //         : section,
  //     ),
  //   },
  //   editingSectionId: null,
  // })),
  // on(UnitsListActions.deleteUnitFailed, (state) => ({
  //   ...state,
  //   editingSectionId: null,
  // })),
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
