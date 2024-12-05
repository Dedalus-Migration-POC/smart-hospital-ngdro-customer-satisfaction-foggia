import {createAction, props} from '@ngrx/store'
import {Section} from '../../repository/dto/section'
import {SectionForm} from '../../pages/section-form/section-form.component'
import {TablePagination} from '../../support/domain/table-pagination'
import {SectionFilterForm} from './reducer'
import {PagedList} from '../../repository/dto/paged_list'

const fetchAllSections = createAction(
  '[Section] Fetch All Sections',
)
const fetchAllSectionsSucceeded = createAction(
  '[Section] Fetch ALl Sections Succeeded',
  props<{ response: PagedList<Section> }>(),
)
const fetchAllSectionsFailed = createAction(
  '[Section] Fetch All Sections Failed',
)

const fetchSections = createAction(
  '[Section] Fetch Sections',
  props<{
    form?: SectionFilterForm['value']
    tablePagination?: Partial<TablePagination>
  }>(),
)

const fetchSectionsSucceeded = createAction(
  '[Section] Fetch Sections Succeeded',
  props<{ response: PagedList<Section> }>(),
)

const fetchSectionsFailed = createAction('[Section] Fetch Sections Failed')

const fetchSectionById = createAction(
  '[Section] Fetch Section by ID',
  props<{ section: Section }>(),
)

const fetchSectionByIdSucceeded = createAction(
  '[Section] Fetch Section by ID Succeeded',
  props<{ section: Section }>(),
)

const fetchSectionByIdFailed = createAction(
  '[Section] Fetch Section by ID Failed',
)

const submitSection = createAction(
  '[Section] Submit Section',
  props<{ sectionForm: SectionForm['value'] }>(),
)

const submitSectionSucceeded = createAction(
  '[Section] Submit Section Succeeded',
  props<{ section: Section }>(),
)

const submitSectionFailed = createAction('[Section] Submit Section Failed')

const cloneSection = createAction(
  '[Section] Clone Section',
  props<{ section: Section }>(),
)

const cloneSectionSucceeded = createAction(
  '[Section] Clone Section Succeeded',
  props<{ section: Section }>(),
)

const cloneSectionFailed = createAction('[Section] Clone Section Failed')

const deleteSection = createAction(
  '[Section] Delete Section',
  props<{ section: Section }>(),
)

const deleteSectionSucceeded = createAction(
  '[Section] Delete Section Succeeded',
  props<{ section: Section }>(),
)

const deleteSectionFailed = createAction('[Section] Delete Section Failed')

const restoreSection = createAction(
  '[Section] Restore Section',
  props<{ section: Section }>(),
)

const restoreSectionSucceeded = createAction(
  '[Section] Restore Section Succeeded',
  props<{ section: Section }>(),
)

const restoreSectionFailed = createAction('[Section] Restore Section Failed')

export const SectionActions = {
  fetchAllSections,
  fetchAllSectionsSucceeded,
  fetchAllSectionsFailed,
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
}

export type SectionActionTypes =
  | typeof fetchAllSections
  | typeof fetchAllSectionsSucceeded
  | typeof fetchAllSectionsFailed
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
