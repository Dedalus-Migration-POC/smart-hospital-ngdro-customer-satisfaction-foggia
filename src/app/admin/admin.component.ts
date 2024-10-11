import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {selectSurveyState, SurveyAdminState} from "./store/reducer";
import {SurveyActions} from "./store/actions";
import {map} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {

  constructor(private store: Store<SurveyAdminState>) {
  }

  ngOnInit() {
    this.initialize()
  }

  protected initialize() {
    this.store.dispatch(SurveyActions.initialize())
  }

  state$ = this.store.select(selectSurveyState)
  initializing$ = this.state$.pipe(map(({initializing}) => initializing))
  initializeError$ = this.state$.pipe(map(({initializeError}) => initializeError))
}

