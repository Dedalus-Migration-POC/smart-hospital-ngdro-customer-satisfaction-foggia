import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { AppActions } from './actions'
import { map, of, switchMap } from 'rxjs'
import { IamService } from '../../repository/iam.service'
import { catchError } from 'rxjs/operators'
import { jwtDecode } from 'jwt-decode'
import { Router } from '@angular/router'
import { DialogService } from '../../support/dialog-service'
import { TranslateService } from '@ngx-translate/core'

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private iamService: IamService,
    private router: Router,
    private dialog: DialogService,
    private translate: TranslateService,
  ) {}

  private readonly initialize$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppActions.initialize),
      switchMap(() =>
        this.iamService.getProfile().pipe(
          map((user) => AppActions.initializeSucceeded({ user })),
          catchError(() => of(AppActions.initializeFailed())),
        ),
      ),
    )
  })

  private readonly login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppActions.login),
      switchMap(({ payload }) =>
        this.iamService.login(payload).pipe(
          map((data) => {
            window.localStorage.setItem('token', JSON.stringify(data))
            const decoded: any = jwtDecode(data.access_token)
            window.localStorage.setItem(
              'profile',
              JSON.stringify({
                // roles: ['ADMIN'],
                roles: decoded.realm_access.roles,
                jwt: data.access_token,
                unit: decoded.units,
              }),
            )

            return AppActions.loginSucceeded({
              user: {
                // roles: ['ADMIN'],
                roles: decoded.realm_access.roles,
                jwt: data.access_token,
                unit: decoded.units,
              },
            })
          }),
          catchError(() => {
            this.dialog.error({
              buttonsType: 'ok',
              title: this.translate.instant('admin.login.error-title'),
              text: this.translate.instant('admin.login.error'),
            })
            return of(AppActions.loginFailed())
          }),
        ),
      ),
    )
  })

  private readonly logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppActions.logout),
      switchMap(({}) =>
        this.iamService.logout().pipe(
          map(() => {
            this.router.navigate(['/login'])
            return AppActions.logoutSucceeded()
          }),
          catchError(() => of(AppActions.logoutFailed())),
        ),
      ),
    )
  })
}
