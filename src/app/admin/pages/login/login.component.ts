import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {SurveyAdminState} from "../../store/store";
import {User, UserRole} from "../../repository/dto/user";
import {AppActions} from "../../store/application/actions";
import {MatButton} from "@angular/material/button";
import {WithSubscriptionsComponent} from "../../support/with-subscriptions-component";
import {Actions, ofType} from "@ngrx/effects";
import {tap} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends WithSubscriptionsComponent implements OnInit {
  constructor(
    private store: Store<SurveyAdminState>,
    private actions: Actions,
    private router: Router
  ) {
    super()
  }

  ngOnInit() {
    this.addSubscription(
      this.actions.pipe(
        ofType(AppActions.loginSucceeded),
        tap(({user}) => {
          this.router.navigate([this.getLandingRoute(user)]).then()
        })
      ).subscribe()
    )
  }

  private getLandingRoute(user: User): string {
    if (user.roles.includes('ROLE_ADMIN')) return '/'
    if (user.roles.includes('ROLE_OPERATOR')) return '/print'
    return '/user'
  }

  protected login(userRole: UserRole) {
    this.store.dispatch(AppActions.login({userRole}));
  }

}
