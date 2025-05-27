import { Store } from '@ngrx/store'
import { SurveyAdminState } from '../store/store'
import { Injectable } from '@angular/core'
import { selectUser } from '../store/application/reducer'
import { Observable, of, switchMap } from 'rxjs'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router'

@Injectable({ providedIn: 'root' })
export class NotRoleRouteGuard implements CanActivate {
  constructor(
    private store: Store<SurveyAdminState>,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.store.select(selectUser).pipe(
      switchMap((user) => {
        if (!user) {
          this.router.navigate(['/login']).then()
          return of(false)
        }
        if (user && user.roles) {
          if (user.roles.includes('OPERATOR')) {
            this.router.navigate(['/print']).then()
            return of(false)
          }
          if (user.roles.includes('ADMIN')) {
            this.router.navigate(['/']).then()
            return of(false)
          }
        }
        return of(true)
      }),
    )
  }
}
