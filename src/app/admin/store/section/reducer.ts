import {createFeatureSelector, createReducer, createSelector, on} from "@ngrx/store";
import {SectionActions} from "./actions";
import {Section} from "../../repository/dto/section";
import {AppActions} from "../application/actions";

const sortSections = (sections: Array<Section>): Array<Section> => {
  let res = [...sections]
  res.sort((a, b) => a.name < b.name ? -1 : 1)
  return res
}

export type State = {
  fetchingSections: boolean;
  fetchSectionsError: boolean;
  sections: Array<Section>;
  creatingSection: boolean;
  editingSectionId: number | null;
  versions: Set<number>;
  showDeleted: boolean;
}

const initialState: State = {
  fetchingSections: false,
  fetchSectionsError: false,
  sections: [],
  creatingSection: false,
  editingSectionId: null,
  versions: new Set([1]),
  showDeleted: false,
}

export const reducer = createReducer(
  initialState,
  on(AppActions.initializeSucceeded, (state, action) => ({
    ...state,
    sections: sortSections(action.sections),
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
    sections: sortSections(action.sections)
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
    sections: sortSections([...state.sections, action.section])
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
    sections: sortSections(state.sections.map(section =>
      section.id === action.section.id
        ? {...action.section}
        : section
    ))
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
    sections: state.sections.map(section =>
      section.id === action.section.id
        ? {...action.section}
        : section
    ),
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
    sections: state.sections.map(section =>
      section.id === action.section.id
        ? {...section, deleted: true}
        : section
    ),
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
    sections: state.sections.map(section =>
      section.id === action.section.id
        ? {...section, deleted: false}
        : section
    ),
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
export const selectSectionList = createSelector(selectSectionState, ({
                                                                       fetchingSections,
                                                                       fetchSectionsError,
                                                                       sections
                                                                     }) => ({
  fetchingSections,
  fetchSectionsError,
  sections
}))
