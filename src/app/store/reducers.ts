import { ActionReducerMap, MetaReducer } from '@ngrx/store'
// import * as fromHome from '../pages/home/home.reducer'

// import { environment } from 'src/environments/environment'

export interface SmartHospitalState {
  // [fromHome.featureKey]: fromHome.State

}

export const reducers: ActionReducerMap<SmartHospitalState> = {
  // [fromHome.featureKey]: fromHome.reducer,

}

export const metaReducers: MetaReducer<SmartHospitalState>[] = []
// !environment.production ? [] : []
