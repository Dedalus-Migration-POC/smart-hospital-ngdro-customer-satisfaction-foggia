import {createFeatureSelector, createReducer, createSelector, on} from "@ngrx/store";
import {SectionActions} from "./actions";
import {Section} from "../../repository/dto/section";
import {AppActions} from "../application/actions";

export type State = {
  fetchingSections: boolean;
  fetchSectionsError: boolean;
  sections: Array<Section>;
  creatingSection: boolean;
  editingSectionId: string | null;
  versions: Set<number>;
}

const initialState: State = {
  fetchingSections: false,
  fetchSectionsError: false,
  sections: [],
  creatingSection: false,
  editingSectionId: null,
  versions: new Set([1])
}

export const reducer = createReducer(
  initialState,
  on(AppActions.initializeSucceeded, (state, action) => ({
    ...state,
    sections: action.sections,
    versions: new Set<number>(action.sections.map(({version}) => version).filter(Boolean).sort((a, b) => a > b ? 1 : -1))
  })),
  on(SectionActions.fetchSections, (state) => ({
    ...state,
    fetchingSections: true,
    fetchSectionsError: false,
  })),
  on(SectionActions.fetchSectionsSucceeded, (state, action) => ({
    ...state,
    fetchingSections: false,
    fetchSectionsError: false,
    sections: action.sections
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
    sections: [...state.sections, action.section]
  })),
  on(SectionActions.fetchSectionByIdFailed, (state) => ({
    ...state,
    fetchingSections: false,
  })),
  on(SectionActions.submitSection, (state) => ({
    ...state,
    creatingSection: true,
  })),
  on(SectionActions.submitSectionSucceeded, (state, action) => {
    if (state.sections.some(s => s.id === action.section.id)) {
      return {
        ...state,
        creatingSection: false,
        sections: [...state.sections.filter(s => s.id !== action.section.id), action.section]
      }
    }
    return {
      ...state,
      creatingSection: false,
      sections: [...state.sections, action.section]
    }
  }),
  on(SectionActions.submitSectionFailed, (state) => ({
    ...state,
    creatingSection: false,
  })),
  on(SectionActions.deleteSection, (state, action) => ({
    ...state,
    editingSectionId: action.sectionId,
  })),
  on(SectionActions.deleteSectionSucceeded, (state, action) => ({
    ...state,
    sections: action.updatedSections,
    editingSectionId: null
  })),
  on(SectionActions.deleteSectionFailed, (state) => ({
    ...state,
    editingSectionId: null
  })),
  on(SectionActions.restoreSection, (state, action) => ({
    ...state,
    editingSectionId: action.sectionId,
  })),
  on(SectionActions.restoreSectionSucceeded, (state, action) => ({
    ...state,
    sections: action.updatedSections,
    editingSectionId: null
  })),
  on(SectionActions.restoreSectionFailed, (state) => ({
    ...state,
    editingSectionId: null
  })),
)

export const selectSectionState = createFeatureSelector<State>('section');
export const selectSectionList = createSelector(selectSectionState, ({
                                                                       fetchingSections,
                                                                       fetchSectionsError,
                                                                       sections
                                                                     }) => ({
  fetchingSections,
  fetchSectionsError,
  sections
}))
