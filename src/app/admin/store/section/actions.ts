import {createAction, props} from '@ngrx/store'
import {Section} from "../../repository/dto/section";
import {SectionForm} from "../../pages/section-form/section-form.component";

const fetchSections = createAction(
  '[Survey] Fetch Sections',
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
  props<{ sectionId: string }>()
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

const deleteSection = createAction(
  '[Survey] Delete Section',
  props<{ sectionId: string }>()
)

const deleteSectionSucceeded = createAction(
  '[Survey] Delete Section Succeeded',
  props<{ updatedSections: Array<Section> }>()
)

const deleteSectionFailed = createAction(
  '[Survey] Delete Section Failed',
)

const restoreSection = createAction(
  '[Survey] Restore Section',
  props<{ sectionId: string }>()
)

const restoreSectionSucceeded = createAction(
  '[Survey] Restore Section Succeeded',
  props<{ updatedSections: Array<Section> }>()
)

const restoreSectionFailed = createAction(
  '[Survey] Restore Section Failed',
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
  deleteSection,
  deleteSectionSucceeded,
  deleteSectionFailed,
  restoreSection,
  restoreSectionSucceeded,
  restoreSectionFailed,
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
  | typeof deleteSection
  | typeof deleteSectionSucceeded
  | typeof deleteSectionFailed
  | typeof restoreSection
  | typeof restoreSectionSucceeded
  | typeof restoreSectionFailed
