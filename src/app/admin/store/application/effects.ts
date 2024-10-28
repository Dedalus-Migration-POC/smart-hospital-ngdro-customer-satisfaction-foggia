import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {AppActions} from "./actions";
import {map, of, switchMap} from "rxjs";
import {IamService} from "../../repository/iam.service";
import {catchError} from "rxjs/operators";


@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private iamService: IamService,
  ) {
  }

  private readonly initialize$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppActions.initialize),
      switchMap(() =>
        this.iamService.getProfile().pipe(
          map((user) => AppActions.initializeSucceeded({user})),
          catchError(() => of(AppActions.initializeFailed()))
        ),
      ),
    )
  })

  private readonly login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppActions.login),
      switchMap(({userRole}) =>
        this.iamService.login(userRole).pipe(
          map((user) => AppActions.loginSucceeded({user})),
          catchError(() => of(AppActions.loginFailed()))
        )
      ),
    )
  })

  private readonly logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppActions.logout),
      map(() => AppActions.logoutSucceeded()),
    )
  })
}

