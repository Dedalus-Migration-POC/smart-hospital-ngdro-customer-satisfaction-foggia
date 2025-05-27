import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { SurveyAdminState } from '../../store/store'
import { User, UserRole } from '../../repository/dto/user'
import { AppActions } from '../../store/application/actions'
import { MatButton } from '@angular/material/button'
import { WithSubscriptionsComponent } from '../../support/with-subscriptions-component'
import { Actions, ofType } from '@ngrx/effects'
import { tap } from 'rxjs'
import { Router } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { NgIf, NgOptimizedImage } from '@angular/common'
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { MatIcon } from '@angular/material/icon'

export type LoginForm = FormGroup<{
  username: FormControl<string | null>
  password: FormControl<string | null>
}>

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButton,
    TranslateModule,
    NgOptimizedImage,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatError,
    NgIf,
    MatIcon,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent
  extends WithSubscriptionsComponent
  implements OnInit
{
  constructor(
    private store: Store<SurveyAdminState>,
    private actions: Actions,
    private fb: FormBuilder,
    private router: Router,
  ) {
    super()
  }
  showPassword = false
  form: LoginForm = this.fb.group({
    username: new FormControl<string | null>(null, [Validators.required]),
    password: new FormControl<string | null>(null, [Validators.required]),
  })

  ngOnInit() {
    const record = window.localStorage.getItem('profile')
    if (record) {
      const user = JSON.parse(record) as User
      this.router.navigate([this.getLandingRoute(user)]).then()
    }
    this.addSubscription(
      this.actions
        .pipe(
          ofType(AppActions.loginSucceeded),
          tap(({ user }) => {
            this.router.navigate([this.getLandingRoute(user)]).then()
          }),
        )
        .subscribe(),
    )
  }

  private getLandingRoute(user: User): string {
    if (user.roles && user.roles.includes('ADMIN')) return '/'
    if (user.roles && user.roles.includes('OPERATOR')) return '/print'
    return '/support'
  }

  protected login() {
    //this.form.markAllAsTouched()
    //if (this.form.valid)
    if (this.form.invalid) {
      return
    }
    this.store.dispatch(
      AppActions.login({
        payload: {
          username: this.form.value.username!,
          password: this.form.value.password!,
        },
      }),
    )
  }
}
