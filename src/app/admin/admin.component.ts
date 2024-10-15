import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {map} from "rxjs";
import {AppActions} from "./store/application/actions";
import {SurveyAdminState} from "./store/store";
import {selectApplicationState} from "./store/application/reducer";

@Component({
  selector: 'app-root',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {

  constructor(private store: Store<SurveyAdminState>) {
    console.log(document.cookie)
  }

  ngOnInit() {
    this.initialize()
  }

  protected initialize() {
    this.store.dispatch(AppActions.initialize())
  }

  state$ = this.store.select(selectApplicationState)
  initializing$ = this.state$.pipe(map(({initializing}) => initializing))
  initializeError$ = this.state$.pipe(map(({initializeError}) => initializeError))
}

