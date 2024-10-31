import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Store } from '@ngrx/store'
import { SmartHospitalState } from 'src/app/store/reducers'
import {
  selectQuestionnaireData,
  selectQuestionnaireError,
  selectQuestionnaireLoading,
} from '../auth/state/selectors'
import { fetchQuestionnaire } from '../auth/state/actions'
import { map } from 'rxjs'

@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.scss'],
})
export class QuestComponent implements OnInit {
  constructor(
    private store: Store<SmartHospitalState>,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['surveyId']) {
        this.store.dispatch(
          fetchQuestionnaire({ surveyId: params['surveyId'] }),
        )
      }
    })
  }
  questionnaire$ = this.store.select(selectQuestionnaireData)
  questionnaireLoading$ = this.store.select(selectQuestionnaireLoading)
  questionnaireError$ = this.store.select(selectQuestionnaireError)
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
