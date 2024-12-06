import {Component, OnInit, ViewChild} from '@angular/core';
import {ScaffoldComponent} from "../../../components/scaffold/scaffold.component";
import {BehaviorSubject, map, of, tap} from "rxjs";
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
import {MatCard} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {selectUser} from "../../../store/application/reducer";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-dashboard-operator',
  standalone: true,
  imports: [
    ScaffoldComponent,
    PrintSurveyComponent,
    AsyncPipe,
    NgIf,
    TranslateModule,
    MatCard,
    MatButton,
    NgOptimizedImage,
    ReactiveFormsModule
  ],
  templateUrl: './dashboard-operator.component.html',
  styleUrl: './dashboard-operator.component.scss'
})
export class DashboardOperatorComponent extends WithSubscriptionsComponent implements OnInit {
  @ViewChild(PrintSurveyComponent) printSurveyComponent!: PrintSurveyComponent;

  protected data$ = new BehaviorSubject<PrintDataResponse | null>(null)
  protected error$ = new BehaviorSubject(false)
  protected loading$ = this.store.select(selectSurveyState).pipe(map(({fetchingPrintData}) => fetchingPrintData));
  protected user$ = this.store.select(selectUser)

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
