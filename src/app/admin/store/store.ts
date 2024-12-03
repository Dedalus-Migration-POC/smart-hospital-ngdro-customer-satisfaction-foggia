import { ActionReducerMap } from '@ngrx/store'
import {
  reducer as AppReducer,
  State as ApplicationState,
} from './application/reducer'
import {
  reducer as SectionReducer,
  State as SectionState,
} from './section/reducer'
import {
  reducer as SurveyReducer,
  State as SurveyState,
} from './survey/reducer'
import { AppEffects } from './application/effects'
import { SectionEffects } from './section/effects'
import { SurveyEffects } from './survey/effects'

export interface SurveyAdminState {
  application: ApplicationState
  section: SectionState
  survey: SurveyState
  allSurvey: SurveyState
}

export const reducers: ActionReducerMap<SurveyAdminState> = {
  application: AppReducer,
  section: SectionReducer,
  survey: SurveyReducer,
  allSurvey: SurveyReducer,
}

export const effects = [AppEffects, SectionEffects, SurveyEffects]
