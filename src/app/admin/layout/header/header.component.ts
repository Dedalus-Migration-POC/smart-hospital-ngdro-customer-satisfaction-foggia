import {Component} from '@angular/core';
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {Store} from "@ngrx/store";
import {SurveyAdminState} from "../../store/store";
import {AppActions} from "../../store/application/actions";
import {UserRole} from "../../repository/dto/user";
import {Actions, ofType} from "@ngrx/effects";
import {map} from "rxjs";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbar, MatToolbarRow, MatIcon, NgOptimizedImage, TranslateModule, RouterLink, MatButton, MatMenuTrigger, MatMenuItem, MatMenu, AsyncPipe, NgIf,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(
    private store: Store<SurveyAdminState>,
    private actions: Actions,
  ) {
    this.actions.pipe(
      ofType(AppActions.loginSucceeded),
      map(() => {
        this.store.dispatch(AppActions.initialize());
      })
    ).subscribe()
  }

  user$ = this.store.select(s => s.application.user)

  protected login(userRole: UserRole) {
    this.store.dispatch(AppActions.login({userRole}))
  }

}
