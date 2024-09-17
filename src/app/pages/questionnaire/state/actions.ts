import { createAction, props } from '@ngrx/store'

export const setQuestionnaire = createAction(
  '[Quest] Set Questionnaire',
  props<{ payload: any }>(),
)
