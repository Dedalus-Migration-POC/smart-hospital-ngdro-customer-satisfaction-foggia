import { Injectable } from '@angular/core'
import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { catchError, EMPTY, finalize, map, Observable, switchMap } from 'rxjs'
import { User } from '../repository/dto/user'
import { jwtDecode } from 'jwt-decode'
import { Router } from '@angular/router'
import { IamService } from '../repository/iam.service'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private iamService: IamService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const record = window.localStorage.getItem('profile')

    if (record) {
      if (this.tokenWillExpireSoon()) {
        const refreshToken = window.localStorage.getItem('token')
        const refreshTokenParse = JSON.parse(refreshToken!)

        return next.handle(
          request.clone({
            headers: request.headers.set(
              'Authorization',
              'Bearer ' + refreshTokenParse.refresh_token,
            ),
          }),
        )
      }
      const user = JSON.parse(record) as User
      return next.handle(
        request.clone({
          headers: request.headers.set('Authorization', 'Bearer ' + user.jwt),
        }),
      )
    }
    return next.handle(request)
    // return this.store.select(selectUser).pipe(
    //   switchMap((user) => {
    //       if (!user) {
    //         console.log('NO USER')
    //         this.router.navigate(["/login"]).then(r => r);
    //       }
    //       console.log('USER FOUND', user)
    //       return next.handle(request)
    //     }
    //   ))
  }

  tokenWillExpireSoon() {
    const token = localStorage.getItem('token')
    if (token) {
      const tokenObj = JSON.parse(token)
      const decodedAccessToken: any = jwtDecode(tokenObj.access_token)
      const decodedRefreshToken: any = jwtDecode(tokenObj.refresh_token)

      const now = Math.round(Date.now() / 1000)
      const remainingAccessToken = Math.round(decodedAccessToken.exp - now)
      const remainingRefreshToken = Math.round(decodedRefreshToken.exp - now)
      console.log('+++remainingAccessToken', remainingAccessToken)

      if (remainingAccessToken < 100) {
        // se sta per scadere l'accessToken oppure se è scaduto ma non è scaduto il refresh
        if (remainingRefreshToken <= 0) {
          this.clearAndReauthenticate()
          return false
        }
        return true
      }
    }
    return false
  }
  private clearAndReauthenticate() {
    localStorage.removeItem('profile')
    localStorage.removeItem('token')
    this.router.navigate(['/login'])
  }
}
