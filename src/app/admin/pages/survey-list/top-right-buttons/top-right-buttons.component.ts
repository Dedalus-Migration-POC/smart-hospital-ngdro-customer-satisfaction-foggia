import {Component} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {BehaviorSubject, EMPTY, finalize, map, Observable} from "rxjs";
import {Section} from "../../../repository/dto/section";
import {selectSectionState} from "../../../store/section/reducer";
import {Store} from "@ngrx/store";
import {SurveyAdminState} from "../../../store/store";
import {MatDialog} from "@angular/material/dialog";
import {PrintSurveyDialogComponent} from "../print-survey-dialog/print-survey-dialog.component";
import {selectSurveyList} from "../../../store/survey/reducer";
import {SurveyService} from "../../../repository/survey-service";
import {catchError} from "rxjs/operators";
import {DialogService} from "../../../support/dialog-service";
import {PrintDataResponse} from "../../../repository/dto/print-data-response";
import {Survey} from "../../../repository/dto/survey";

@Component({
  selector: 'app-top-right-buttons',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButton,
    MatIcon,
    RouterLink,
    TranslateModule
  ],
  templateUrl: './top-right-buttons.component.html',
  styleUrl: './top-right-buttons.component.scss'
})
export class TopRightButtonsComponent {
  constructor(
    private store: Store<SurveyAdminState>,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private translate: TranslateService,
    private surveyService: SurveyService,
  ) {
  }

  surveys$: Observable<Array<Survey> | undefined> = this.store.select(selectSurveyList)
    .pipe(map(({surveys}) => surveys?.content));

  sections$: Observable<Array<Section> | undefined> = this.store.select(selectSectionState)
    .pipe(map(({sections}) => sections?.content));

  protected loading$ = new BehaviorSubject(false);

  protected print() {
    this.loading$.next(true)
    this.surveyService.requestPrintData().pipe(
      map(data => {
        if (!data.surveys.length) {
          this.dialogService.error({
            buttonsType: 'ok',
            text: this.translate.instant('admin.print-survey-dialog.no-surveys-error'),
          })
        } else {
          this.dialog.open<PrintSurveyDialogComponent, PrintDataResponse>(PrintSurveyDialogComponent, {
            id: "print_survey_dialog_id",
            width: '480px',
            maxWidth: '480px',
            minHeight: '560px',
            hasBackdrop: true,
            disableClose: true,
            data
          })
        }
      }),
      catchError(() => {
        this.dialogService.error({buttonsType: 'ok'})
        return EMPTY
      }),
      finalize(() => (this.loading$.next(false)))
    ).subscribe();
  }

  protected viewAnalytics() {
    console.log('missing analytics url')
  }
}
