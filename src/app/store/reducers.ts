import { ActionReducerMap, MetaReducer } from '@ngrx/store'
import * as fromAuth from '../pages/auth/state/reducer'
import * as fromQuest from '../pages/questionnaire/state/reducer'

// import { environment } from 'src/environments/environment'

export interface SmartHospitalState {
  [fromAuth.featureKey]: fromAuth.State
  [fromQuest.featureKey]: fromQuest.State
}

export const reducers: ActionReducerMap<SmartHospitalState> = {
  [fromAuth.featureKey]: fromAuth.reducer,
  [fromQuest.featureKey]: fromQuest.reducer,
}

export const metaReducers: MetaReducer<SmartHospitalState>[] = []
// !environment.production ? [] : []
