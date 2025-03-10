import { Component, OnInit } from '@angular/core'
import { AsyncPipe } from '@angular/common'
import { MatButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { RouterLink } from '@angular/router'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { map, Observable, tap } from 'rxjs'
import { Section } from '../../../repository/dto/section'
import { selectSectionState } from '../../../store/section/reducer'
import { Store } from '@ngrx/store'
import { SurveyAdminState } from '../../../store/store'
import { MatDialog } from '@angular/material/dialog'
import { PrintSurveyDialogComponent } from '../print-survey-dialog/print-survey-dialog.component'
import {
  selectSurveyList,
  selectSurveyState,
} from '../../../store/survey/reducer'
import { DialogService } from '../../../support/dialog-service'
import { PrintDataResponse } from '../../../repository/dto/print-data-response'
import { Survey } from '../../../repository/dto/survey'
import { WithSubscriptionsComponent } from '../../../support/with-subscriptions-component'
import { SurveyActions } from '../../../store/survey/actions'
import { Actions, ofType } from '@ngrx/effects'

@Component({
  selector: 'app-top-right-buttons',
  standalone: true,
  imports: [AsyncPipe, MatButton, MatIcon, RouterLink, TranslateModule],
  templateUrl: './top-right-buttons.component.html',
  styleUrl: './top-right-buttons.component.scss',
})
export class TopRightButtonsComponent
  extends WithSubscriptionsComponent
  implements OnInit
{
  constructor(
    private store: Store<SurveyAdminState>,
    private actions: Actions,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private translate: TranslateService,
  ) {
    super()
  }

  ngOnInit() {
    this.addSubscriptions(
      this.actions
        .pipe(
          ofType(SurveyActions.fetchPrintSurveyDataSucceeded),
          tap(({ data }) =>
            this.dialog.open<PrintSurveyDialogComponent, PrintDataResponse>(
              PrintSurveyDialogComponent,
              {
                id: 'print_survey_dialog_id',
                width: '480px',
                maxWidth: '480px',
                minHeight: '560px',
                hasBackdrop: true,
                disableClose: true,
                data,
              },
            ),
          ),
        )
        .subscribe(),

      this.actions
        .pipe(
          ofType(SurveyActions.fetchPrintSurveyDataFailed),
          tap(({ error }) =>
            this.dialogService.error({
              buttonsType: 'ok',
              text: this.translate.instant(
                error ? 'admin.print-survey-dialog.no-surveys-error' : 'error',
              ),
            }),
          ),
        )
        .subscribe(),
    )
  }

  surveys$: Observable<Array<Survey> | undefined> = this.store
    .select(selectSurveyList)
    .pipe(map(({ surveys }) => surveys?.content))

  sections$: Observable<Array<Section> | undefined> = this.store
    .select(selectSectionState)
    .pipe(map(({ sections }) => sections?.content))

  protected loading$ = this.store
    .select(selectSurveyState)
    .pipe(map(({ fetchingPrintData }) => fetchingPrintData))

  protected print() {
    this.store.dispatch(SurveyActions.fetchPrintSurveyData())
  }

  protected viewAnalytics() {
    window.open('http://138.66.71.123:3000/auth/login', '_blank')
  }
}
