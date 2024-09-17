import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Store } from '@ngrx/store'
import { SmartHospitalState } from 'src/app/store/reducers'
import { selectQuestionnaireData } from '../auth/state/selectors'
import { fetchQuestionnaire } from '../auth/state/actions'

@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.scss'],
})
export class QuestComponent implements OnInit {
  constructor(private store: Store<SmartHospitalState>) {}

  ngOnInit(): void {
    this.store.dispatch(
      fetchQuestionnaire({ payload: { otp: '123', consent: true } }),
    )
  }
  questionnaire$ = this.store.select(selectQuestionnaireData)
  activeStep = 0

  onForwardClick(): void {
    this.activeStep++
  }
  onBackClick(activeStep: number): void {
    if (activeStep > 0) {
      this.activeStep--
    }
  }
}
