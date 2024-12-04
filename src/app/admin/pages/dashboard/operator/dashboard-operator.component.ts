import {Component, OnInit, ViewChild} from '@angular/core';
import {ScaffoldComponent} from "../../../components/scaffold/scaffold.component";
import {BehaviorSubject, map, of, tap} from "rxjs";
import {PrintSurveyDialogComponent} from "../../survey-list/print-survey-dialog/print-survey-dialog.component";
import {PrintSurveyComponent} from "../../../components/print-survey/print-survey.component";
import {Store} from "@ngrx/store";
import {SurveyAdminState} from "../../../store/store";
import {SurveyActions} from "../../../store/survey/actions";
import {PrintDataResponse} from "../../../repository/dto/print-data-response";
import {WithSubscriptionsComponent} from "../../../support/with-subscriptions-component";
import {Actions, ofType} from "@ngrx/effects";
import {DialogService} from "../../../support/dialog-service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {selectSurveyState} from "../../../store/survey/reducer";
import {MatDialogTitle} from "@angular/material/dialog";
import {MatCard} from "@angular/material/card";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-dashboard-operator',
  standalone: true,
  imports: [
    ScaffoldComponent,
    PrintSurveyDialogComponent,
    PrintSurveyComponent,
    AsyncPipe,
    NgIf,
    MatDialogTitle,
    TranslateModule,
    MatCard,
    MatButton,
    NgOptimizedImage
  ],
  templateUrl: './dashboard-operator.component.html',
  styleUrl: './dashboard-operator.component.scss'
})
export class DashboardOperatorComponent extends WithSubscriptionsComponent implements OnInit {
  @ViewChild(PrintSurveyComponent) printSurveyComponent!: PrintSurveyComponent;

  protected data$ = new BehaviorSubject<PrintDataResponse | null>(null)
  protected error$ = new BehaviorSubject(false)
  protected loading$ = this.store.select(selectSurveyState).pipe(map(({fetchingPrintData}) => fetchingPrintData));

  constructor(
    private store: Store<SurveyAdminState>,
    private actions: Actions,
    private translate: TranslateService,
    private dialogService: DialogService
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(SurveyActions.fetchPrintSurveyData())

    this.addSubscriptions(
      this.actions.pipe(
        ofType(SurveyActions.fetchPrintSurveyDataSucceeded),
        tap(({data}) => this.data$.next(data)),
      ).subscribe(),

      this.actions.pipe(
        ofType(SurveyActions.fetchPrintSurveyDataFailed),
        tap(({error}) => this.dialogService.error({
          buttonsType: 'ok',
          text: this.translate.instant(error ? 'admin.print-survey-dialog.no-surveys-error' : 'error'),
        }))
      ).subscribe()
    )
  }

  protected viewAnalytics() {
    console.log('missing analytics url')
  }

  protected print() {
    this.printSurveyComponent.print()
  }

  protected readonly of = of;
}
