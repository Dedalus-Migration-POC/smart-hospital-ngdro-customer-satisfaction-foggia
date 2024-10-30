import {createFeatureSelector, createReducer, createSelector, on} from "@ngrx/store";
import {SectionActions} from "./actions";
import {Section} from "../../repository/dto/section";
import {AppActions} from "../application/actions";
import {SurveyAdminState} from "../store";
import {TablePagination} from "../../support/domain/table-pagination";
import {FormControl, FormGroup} from "@angular/forms";
import {PagedList} from "../../repository/dto/paged_list";

export type SectionFilterForm = FormGroup<{
  name: FormControl<string | null>;
  version: FormControl<number | null>;
  presentIn: FormControl<number | null>
}>

export type State = {
  fetchingSections: boolean;
  fetchSectionsError: boolean;
  sections: PagedList<Section> | null;
  creatingSection: boolean;
  editingSectionId: number | null;
  versions: Set<number>;
  showDeleted: boolean;
  searchCriteria: {
    filter: SectionFilterForm['value'];
    tablePagination: TablePagination | undefined;
  }
}

const initialState: State = {
  fetchingSections: false,
  fetchSectionsError: false,
  sections: null,
  creatingSection: false,
  editingSectionId: null,
  versions: new Set([1]),
  showDeleted: false,
  searchCriteria: {
    filter: {},
    tablePagination: {
      size: 5,
      sort: 'name,asc'
    }
  }
}

export const reducer = createReducer(
  initialState,
  //FIXME remove it
  on(AppActions.initializeSucceeded, (state, action) => ({
    ...state,
    //versions: new Set<number>(action.sections.map(({version}) => version).filter(Boolean).sort((a, b) => a > b ? 1 : -1))
  })),
  on(SectionActions.fetchSections, (state, {form, tablePagination}) => ({
    ...state,
    fetchingSections: true,
    fetchSectionsError: false,
    searchCriteria: {
      filter: {...state.searchCriteria.filter, ...form},
      tablePagination: {...state.searchCriteria.tablePagination, ...tablePagination},
    }
  })),
  on(SectionActions.fetchSectionsSucceeded, (state, action) => ({
    ...state,
    fetchingSections: false,
    fetchSectionsError: false,
    sections: action.response,
    versions: new Set<number>(action.response.content.map(({version}) => version).filter(Boolean).sort((a, b) => a > b ? 1 : -1))
  })),
  on(SectionActions.fetchSectionsFailed, (state) => ({
    ...state,
    fetchingSections: false,
    fetchSectionsError: true,
  })),
  on(SectionActions.fetchSectionById, (state) => ({
    ...state,
    fetchingSections: true,
  })),
  on(SectionActions.fetchSectionByIdSucceeded, (state, action) => ({
    ...state,
    fetchingSections: false,
    sections: {
      ...state.sections!,
      content: state.sections!.content.map(s => s.id === action.section.id ? action.section : s)
    }
  })),
  on(SectionActions.fetchSectionByIdFailed, (state) => ({
    ...state,
    fetchingSections: false,
  })),
  on(SectionActions.submitSection, (state) => ({
    ...state,
    creatingSection: true,
  })),
  on(SectionActions.submitSectionSucceeded, (state, action) => ({
    ...state,
    creatingSection: false,
    sections: {
      ...state.sections!,
      content: [action.section, ...state.sections!.content]
    }
  })),
  on(SectionActions.submitSectionFailed, (state) => ({
    ...state,
    creatingSection: false,
  })),
  on(SectionActions.cloneSection, (state, action) => ({
    ...state,
    editingSectionId: action.section.id!,
  })),
  on(SectionActions.cloneSectionSucceeded, (state, action) => ({
    ...state,
    sections: {
      ...state.sections!,
      content: [action.section, ...state.sections!.content]
    },
    editingSectionId: null
  })),
  on(SectionActions.cloneSectionFailed, (state) => ({
    ...state,
    editingSectionId: null
  })),
  on(SectionActions.deleteSection, (state, action) => ({
    ...state,
    editingSectionId: action.section.id!,
  })),
  on(SectionActions.deleteSectionSucceeded, (state, action) => ({
    ...state,
    sections: {
      ...state.sections!,
      content: state.sections!.content.map(section =>
        section.id === action.section.id
          ? {...section, deleted: true}
          : section
      )
    },
    editingSectionId: null
  })),
  on(SectionActions.deleteSectionFailed, (state) => ({
    ...state,
    editingSectionId: null
  })),
  on(SectionActions.restoreSection, (state, action) => ({
    ...state,
    editingSectionId: action.section.id!,
  })),
  on(SectionActions.restoreSectionSucceeded, (state, action) => ({
    ...state,
    sections: {
      ...state.sections!,
      content: state.sections!.content.map(section =>
        section.id === action.section.id
          ? {...section, deleted: false}
          : section
      )
    },
    editingSectionId: null
  })),
  on(SectionActions.restoreSectionFailed, (state) => ({
    ...state,
    editingSectionId: null
  })),
  on(SectionActions.toggleShowDeleted, (state) => ({
    ...state,
    showDeleted: !state.showDeleted
  })),
)

export const selectSectionState = createFeatureSelector<State>('section');
export const selectSectionSearchCriteria = createSelector((state: SurveyAdminState) => state.section, (({
                                                                                                          searchCriteria
                                                                                                        }) => searchCriteria))
export const selectSectionList = createSelector((state: SurveyAdminState) => state.section, ({
                                                                                               fetchingSections,
                                                                                               fetchSectionsError,
                                                                                               sections
                                                                                             }) => ({
  fetchingSections,
  fetchSectionsError,
  sections
}))
