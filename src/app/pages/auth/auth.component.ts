import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Store } from '@ngrx/store'
import { SmartHospitalState } from 'src/app/store/reducers'
import { fetchQuestionnaire, getHealthcareUnit, sendOtp } from './state/actions'
import {
  selectHealthcareUnit,
  selectLoading,
  selectQuestionnaireData,
  selectQuestionnaireLoading,
} from './state/selectors'

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
  questType: string = ''
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.structureType = params['structure']
      this.unit = params['healthcareUnitId']
      this.questType = params['surveyId']
      if (params['healthcareUnitId']) {
        this.store.dispatch(
          getHealthcareUnit({ healthcareUnitId: params['healthcareUnitId'] }),
        )
      }
      if (params['surveyId']) {
        this.store.dispatch(
          fetchQuestionnaire({ surveyId: params['surveyId'] }),
        )
      }
    })
  }
  healthcareUnit$ = this.store.select(selectHealthcareUnit)
  survey$ = this.store.select(selectQuestionnaireData)
  loading$ =
    this.store.select(selectLoading) ||
    this.store.select(selectQuestionnaireLoading)

  sendOtp(form: { otp: string; consent: boolean }) {
    this.store.dispatch(
      sendOtp({
        otp: form.otp,
        payload: {
          surveyId: this.questType,
          healthcareUnitId: this.unit,
          structure: this.structureType,
        },
      }),
    )
  }
}
