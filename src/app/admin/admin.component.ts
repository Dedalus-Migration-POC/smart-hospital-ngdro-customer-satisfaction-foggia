import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {SurveyAdminState} from "./store/store";
import {AppActions} from "./store/application/actions";

@Component({
  selector: 'app-root',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  constructor(private store: Store<SurveyAdminState>) {
  }

  ngOnInit() {
    this.store.dispatch(AppActions.initialize())
  }

}

