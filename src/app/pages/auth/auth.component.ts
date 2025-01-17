import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Store } from '@ngrx/store'
import { SmartHospitalState } from 'src/app/store/reducers'
import { fetchQuestionnaire, sendOtp } from './state/actions'
import {
  selectQuestionnaireData,
  selectQuestionnaireError,
  selectQuestionnaireLoading,
} from './state/selectors'
import { map, take } from 'rxjs'
import { setIsSurveyConfirmed } from '../questionnaire/state/actions'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<SmartHospitalState>,
  ) {}

  structureType: string = ''
  unit: string = ''
  surveyName: string = ''
  surveyId: string = ''
  ngOnInit(): void {
    this.store.dispatch(setIsSurveyConfirmed({ isSurveyConfirmed: false }))
    this.activatedRoute.params.subscribe((params) => {
      this.surveyId = params['id']
      if (params['id']) {
        this.store.dispatch(fetchQuestionnaire({ surveyId: params['id'] }))
      }
    })

    this.store
      .select(selectQuestionnaireData)
      .pipe(
        map(
          (resp) => (
            (this.structureType = resp?.structure!),
            (this.surveyName = resp?.survey.name!),
            (this.unit = resp?.healthcareUnit?.name!)
          ),
        ),
      )
      .subscribe()
  }
  healthcareUnit = { name: '' }

  loading$ = this.store.select(selectQuestionnaireLoading)
  error$ = this.store.select(selectQuestionnaireError)

  sendOtp(form: { otp: string; age: string; consent: boolean }) {
    this.store.dispatch(
      sendOtp({
        otp: form.otp,
        age: form.age,
        payload: {
          surveyId: this.surveyId,
        },
      }),
    )
  }
}
