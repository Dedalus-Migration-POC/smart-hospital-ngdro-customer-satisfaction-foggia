import {Component, OnInit} from '@angular/core';
import {SurveyListComponent} from "../survey-list/survey-list.component";
import {SectionListComponent} from "../section-list/section-list.component";
import {TopRightButtonsComponent} from "../survey-list/top-right-buttons/top-right-buttons.component";
import {map} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {ScaffoldComponent} from "../../components/scaffold/scaffold.component";
import {selectApplicationState} from "../../store/application/reducer";
import {Store} from "@ngrx/store";
import {SurveyAdminState} from "../../store/store";
import {SurveyActions} from "../../store/survey/actions";
import {SectionActions} from "../../store/section/actions";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SurveyListComponent,
    SectionListComponent,
    TopRightButtonsComponent,
    AsyncPipe,
    NgIf,
    ScaffoldComponent
  ],
  template: `
    <app-scaffold [loading]="initializing$"
                  [error]="initializeError$"
                  (onErrorRetryCallback)="initialize()"
    >
      <ng-container *ngIf="!(initializing$ | async) && !(initializeError$ | async)">
        <app-top-right-buttons></app-top-right-buttons>
        <app-survey-list></app-survey-list>
        <div style="margin: 32px 0"></div>
        <app-section-list></app-section-list>
      </ng-container>
    </app-scaffold>
  `,
})
export class DashboardComponent implements OnInit {

  constructor(private store: Store<SurveyAdminState>) {
  }

  ngOnInit() {
    this.initialize()
  }

  protected initialize() {
    this.store.dispatch(SurveyActions.fetchSurveys({}))
    this.store.dispatch(SectionActions.fetchSections({}))
  }

  state$ = this.store.select(selectApplicationState)
  initializing$ = this.state$.pipe(map(({initializing}) => initializing))
  initializeError$ = this.state$.pipe(map(({initializeError}) => initializeError))
}
