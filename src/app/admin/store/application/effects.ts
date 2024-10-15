import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {SurveyService} from "../../repository/survey-service";
import {AppActions} from "./actions";
import {catchError, concatMap} from "rxjs/operators";
import {forkJoin, map, of} from "rxjs";
import {SectionService} from "../../repository/section-service";
import {User, UserRole} from "../../repository/dto/user";


@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private surveyService: SurveyService,
    private sectionService: SectionService,
  ) {
  }

  private readonly initialize$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppActions.initialize),
      concatMap(() =>
        forkJoin([
          this.surveyService.list(),
          this.sectionService.list()
        ]).pipe(
          map(([surveys, sections]) =>
            AppActions.initializeSucceeded({surveys, sections})
          ),
          catchError(() =>
            of(AppActions.initializeFailed())
          )
        ),
      ),
    )
  })

  private readonly login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppActions.login),
      map((action) => {
          document.cookie = `access_token=${this.Users[action.userRole].jwt}; Path=/; Expires=Thu, 01 Jan 2025 00:00:01 GMT;`
          return AppActions.loginSucceeded({user: this.Users[action.userRole]})
        }
      ),
    )
  })

  private Users: Record<UserRole, User> = {
    ROLE_ADMIN: {
      name: "Administrator",
      roles: ['ROLE_ADMIN'],
      jwt: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3Mjg5MzE1MDIsImV4cCI6MTc2MDQ2NzUwMiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6IkFkbWluIiwibGFzdE5hbWUiOiJBZG1pbiIsIkVtYWlsIjoianJvY2tldEBleGFtcGxlLmNvbSIsIlJvbGUiOlsiUk9MRV9BRE1JTiIsIlJPTEVfT1BFUkFUT1IiXX0.4pS1fwGB0gCJD67Ba8p0ipzDaRK3_A20NdryCPtL0No"
    },
    ROLE_OPERATOR: {
      name: "Operator",
      roles: ['ROLE_OPERATOR'],
      jwt: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3Mjg5MzE1MDIsImV4cCI6MTc2MDQ2NzUwMiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6Ik9wZXJhdG9yIiwibGFzdE5hbWUiOiJPcGVyYXRvciIsIkVtYWlsIjoib3BlcmF0b3JAc3VydmV5Lm1zIiwiUm9sZSI6WyJST0xFX1VTRVIiLCJST0xFX09QRVJBVE9SIl19.r7D-vsvTV9cfDJO8bzEwvh734VSekVAmg9PCUDCc9pE"
    },
    ROLE_USER: {
      name: "User",
      roles: ['ROLE_USER'],
      jwt: ""
    }
  }
}
