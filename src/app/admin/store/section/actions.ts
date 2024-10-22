import {createAction, props} from '@ngrx/store'
import {Section} from "../../repository/dto/section";
import {SectionForm} from "../../pages/section-form/section-form.component";
import {SectionFilterForm} from "../../pages/section-list/section-list-table/filter/filter.component";

const fetchSections = createAction(
  '[Section] Fetch Sections',
  props<{ form: SectionFilterForm['value'] }>()
)

const fetchSectionsSucceeded = createAction(
  '[Section] Fetch Sections Succeeded',
  props<{ sections: Array<Section> }>(),
)

const fetchSectionsFailed = createAction(
  '[Section] Fetch Sections Failed',
)

const fetchSectionById = createAction(
  '[Section] Fetch Section by ID',
  props<{ section: Section }>()
)

const fetchSectionByIdSucceeded = createAction(
  '[Section] Fetch Section by ID Succeeded',
  props<{ section: Section }>()
)

const fetchSectionByIdFailed = createAction(
  '[Section] Fetch Section by ID Failed',
)

const submitSection = createAction(
  '[Section] Submit Section',
  props<{ sectionForm: SectionForm['value'] }>()
)

const submitSectionSucceeded = createAction(
  '[Section] Submit Section Succeeded',
  props<{ section: Section }>()
)

const submitSectionFailed = createAction(
  '[Section] Submit Section Failed',
)

const cloneSection = createAction(
  '[Section] Clone Section',
  props<{ section: Section }>()
)

const cloneSectionSucceeded = createAction(
  '[Section] Clone Section Succeeded',
  props<{ section: Section }>()
)

const cloneSectionFailed = createAction(
  '[Section] Clone Section Failed',
)

const deleteSection = createAction(
  '[Section] Delete Section',
  props<{ section: Section }>()
)

const deleteSectionSucceeded = createAction(
  '[Section] Delete Section Succeeded',
  props<{ section: Section }>()
)

const deleteSectionFailed = createAction(
  '[Section] Delete Section Failed',
)

const restoreSection = createAction(
  '[Section] Restore Section',
  props<{ section: Section }>()
)

const restoreSectionSucceeded = createAction(
  '[Section] Restore Section Succeeded',
  props<{ section: Section }>()
)

const restoreSectionFailed = createAction(
  '[Section] Restore Section Failed',
)

const toggleShowDeleted = createAction(
  '[Section] Toggle Show Deleted',
)

export const SectionActions = {
  fetchSections,
  fetchSectionsSucceeded,
  fetchSectionsFailed,
  fetchSectionById,
  fetchSectionByIdSucceeded,
  fetchSectionByIdFailed,
  submitSection,
  submitSectionSucceeded,
  submitSectionFailed,
  cloneSection,
  cloneSectionSucceeded,
  cloneSectionFailed,
  deleteSection,
  deleteSectionSucceeded,
  deleteSectionFailed,
  restoreSection,
  restoreSectionSucceeded,
  restoreSectionFailed,
  toggleShowDeleted
}

export type SectionActionTypes =
  | typeof fetchSections
  | typeof fetchSectionsSucceeded
  | typeof fetchSectionsFailed
  | typeof fetchSectionById
  | typeof fetchSectionByIdSucceeded
  | typeof fetchSectionByIdFailed
  | typeof submitSection
  | typeof submitSectionSucceeded
  | typeof submitSectionFailed
  | typeof cloneSection
  | typeof cloneSectionSucceeded
  | typeof cloneSectionFailed
  | typeof deleteSection
  | typeof deleteSectionSucceeded
  | typeof deleteSectionFailed
  | typeof restoreSection
  | typeof restoreSectionSucceeded
  | typeof restoreSectionFailed
  | typeof toggleShowDeleted
