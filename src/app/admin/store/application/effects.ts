import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {SurveyService} from "../../repository/survey-service";
import {AppActions} from "./actions";
import {map} from "rxjs";
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

  //FIXME implementare login
  // private readonly initialize$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(AppActions.initialize),
  //     concatMap(() =>
  //       forkJoin([
  //         this.surveyService.find({}),
  //         this.sectionService.find({})
  //       ]).pipe(
  //         map(([{content: surveys}, {content: sections}]) =>
  //           AppActions.initializeSucceeded({surveys, sections})
  //         ),
  //         catchError(() =>
  //           of(AppActions.initializeFailed())
  //         )
  //       ),
  //     ),
  //   )
  // })

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

  private readonly logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppActions.logout),
      map(() => {
          document.cookie = 'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          return AppActions.logoutSucceeded()
        }
      ),
    )
  })

  private Users: Record<UserRole, User> = {
    ROLE_ADMIN: {
      name: "Administrator",
      roles: ['ROLE_ADMIN'],
      jwt: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJTQ01vY2siLCJpYXQiOjE3Mjg5NzQ3NTQsImV4cCI6MTc2MDUxMDc1NCwiYXVkIjoid3d3LmRlZGFsdXMuY29tIiwic3ViIjoiYWRtaW5Ac3VydmV5LmRlZGFsdXMubXMiLCJmaXJzdG5hbWUiOiJBZG1pbiIsImxhc3RuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQHN1cnZleS5tcyIsInJvbGUiOlsiUk9MRV9BRE1JTiIsIlJPTEVfT1BFUkFUT1IiLCJST0xFX1VTRVIiXX0.MURwcvADg5uUVrtcxCET6ACZjujFw2HjTMzzyBV1y8A"
    },
    ROLE_OPERATOR: {
      name: "Operator",
      roles: ['ROLE_OPERATOR'],
      jwt: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJTQ01vY2siLCJpYXQiOjE3Mjg5NzQ3NTQsImV4cCI6MTc2MDUxMDc1NCwiYXVkIjoid3d3LmRlZGFsdXMuY29tIiwic3ViIjoiYWRtaW5Ac3VydmV5LmRlZGFsdXMubXMiLCJmaXJzdG5hbWUiOiJPcGVyYXRvciIsImxhc3RuYW1lIjoiT3BlcmF0b3IiLCJlbWFpbCI6Im9wZXJhdG9yQHN1cnZleS5tcyIsInJvbGUiOlsiUk9MRV9PUEVSQVRPUiIsIlJPTEVfVVNFUiJdfQ.ma_oLROwsB0DKtunDB_-5DBE404wexdc2_6jtNCdbkw"
    },
    ROLE_USER: {
      name: "User",
      roles: ['ROLE_USER'],
      jwt: ""
    }
  }
}

