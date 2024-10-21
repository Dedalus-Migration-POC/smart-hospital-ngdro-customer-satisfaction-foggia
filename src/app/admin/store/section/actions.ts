import {createAction, props} from '@ngrx/store'
import {Section} from "../../repository/dto/section";
import {SectionForm} from "../../pages/section-form/section-form.component";
import {SectionFilterForm} from "../../pages/section-list/section-list-table/filter/filter.component";

const fetchSections = createAction(
  '[Survey] Fetch Sections',
  props<{ form: SectionFilterForm['value'] }>()
)

const fetchSectionsSucceeded = createAction(
  '[Survey] Fetch Sections Succeeded',
  props<{ sections: Array<Section> }>(),
)

const fetchSectionsFailed = createAction(
  '[Survey] Fetch Sections Failed',
)

const fetchSectionById = createAction(
  '[Survey] Fetch Section by ID',
  props<{ section: Section }>()
)

const fetchSectionByIdSucceeded = createAction(
  '[Survey] Fetch Section by ID Succeeded',
  props<{ section: Section }>()
)

const fetchSectionByIdFailed = createAction(
  '[Survey] Fetch Section by ID Failed',
)

const submitSection = createAction(
  '[Survey] Submit Section',
  props<{ sectionForm: SectionForm['value'] }>()
)

const submitSectionSucceeded = createAction(
  '[Survey] Submit Section Succeeded',
  props<{ section: Section }>()
)

const submitSectionFailed = createAction(
  '[Survey] Submit Section Failed',
)

const cloneSection = createAction(
  '[Survey] Clone Section',
  props<{ section: Section }>()
)

const cloneSectionSucceeded = createAction(
  '[Survey] Clone Section Succeeded',
  props<{ section: Section }>()
)

const cloneSectionFailed = createAction(
  '[Survey] Clone Section Failed',
)

const deleteSection = createAction(
  '[Survey] Delete Section',
  props<{ section: Section }>()
)

const deleteSectionSucceeded = createAction(
  '[Survey] Delete Section Succeeded',
  props<{ section: Section }>()
)

const deleteSectionFailed = createAction(
  '[Survey] Delete Section Failed',
)

const restoreSection = createAction(
  '[Survey] Restore Section',
  props<{ section: Section }>()
)

const restoreSectionSucceeded = createAction(
  '[Survey] Restore Section Succeeded',
  props<{ section: Section }>()
)

const restoreSectionFailed = createAction(
  '[Survey] Restore Section Failed',
)

const toggleShowDeleted = createAction(
  '[Survey] Toggle Show Deleted',
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
