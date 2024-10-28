import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Store } from '@ngrx/store'
import { SmartHospitalState } from 'src/app/store/reducers'
import { selectQuestionnaireData } from '../auth/state/selectors'
import { fetchQuestionnaire } from '../auth/state/actions'
import { map } from 'rxjs'

@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.scss'],
})
export class QuestComponent implements OnInit {
  constructor(private store: Store<SmartHospitalState>) {}

  ngOnInit(): void {}
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
