import { Injectable } from '@angular/core'
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http'
import { catchError, EMPTY, Observable, Subject, tap, throwError } from 'rxjs'
import { User } from '../repository/dto/user'
import { jwtDecode } from 'jwt-decode'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  tokenRefreshedSource = new Subject()
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let record = window.localStorage.getItem('profile')
    if (record && !this.tokenWillExpireSoon()) {
      const user = JSON.parse(record!) as User
      return next.handle(
        request.clone({
          headers: request.headers.set('Authorization', 'Bearer ' + user.jwt),
        }),
      )
    } else if (record && this.tokenWillExpireSoon()) {
      const user = JSON.parse(record!) as User
      let newUser: User | null
      let newrecord
      next
        .handle(this.getRefreshTokenHttpRequest())
        .pipe(
          tap((event) => {
            if (event instanceof HttpResponse) {
              window.localStorage.setItem(
                'profile',
                JSON.stringify({
                  ...user,
                  jwt: event.body.access_token,
                }),
              )
              window.localStorage.setItem('token', JSON.stringify(event.body))
              newrecord = window.localStorage.getItem('profile')
              newUser = JSON.parse(newrecord!) as User
            }
            this.tokenRefreshedSource.next(event)
          }),
          catchError((err) => {
            this.handleExpiredAuthentication(err)
            return throwError(() => err)
          }),
        )
        .subscribe()

      return new Observable((observer) => {
        let tokenRefreshed$ = this.tokenRefreshedSource
          .asObservable()
          .subscribe((event: any) => {
            next
              .handle(
                request.clone({
                  headers: request.headers.set(
                    'Authorization',
                    'Bearer ' + event.body.access_token,
                  ),
                }),
              )
              .pipe(
                catchError((error) => {
                  this.handleExpiredAuthentication(error)
                  observer.error(error)
                  observer.complete()
                  observer.unsubscribe()
                  tokenRefreshed$.unsubscribe()
                  return EMPTY
                }),
              )
              .subscribe((event) => {
                if (event instanceof HttpResponse) {
                  observer.next(event)
                  observer.complete()
                  observer.unsubscribe()
                  tokenRefreshed$.unsubscribe()
                }
              })
          })
      })
    }
    return next.handle(request)
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

    document.cookie =
      'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    document.cookie =
      'session_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'

    this.router.navigate(['/login'])
  }

  getRefreshTokenHttpRequest() {
    let headers = new HttpHeaders()

    const token = window.localStorage.getItem('token')
    const refreshTokenParse = JSON.parse(token!).refresh_token
    let body = new URLSearchParams()
    body.set('grant_type', 'refresh_token')
    body.set('scope', 'openid profile')
    body.set('client_id', 'frontend')
    body.set('refresh_token', refreshTokenParse)

    const headerName = 'Content-Type'
    if (refreshTokenParse) {
      headers = headers.set(headerName, 'application/x-www-form-urlencoded')
    }
    return new HttpRequest(
      'POST',
      environment.keycloakEndpoint + '/protocol/openid-connect/token',
      body.toString(),
      {
        headers: headers,
        withCredentials: true,
      },
    )
  }

  private handleExpiredAuthentication(event: HttpEvent<any>) {
    if (event instanceof HttpErrorResponse) {
      if (event && event.status === 401) {
        this.clearAndReauthenticate()
      }
    }
    return event
  }
}
