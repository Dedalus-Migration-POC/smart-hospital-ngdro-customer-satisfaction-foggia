import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor,} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {Store} from "@ngrx/store";
import {SurveyAdminState} from "../store/store";
import {selectUser} from "../store/application/reducer";
import {User} from "../repository/dto/user";

const CSRF_HEADER = 'X-XSRF-TOKEN';

@Injectable({providedIn: 'root'})
export class AppHttpInterceptors implements HttpInterceptor {
  constructor(
    private tokenExtractor: HttpXsrfTokenExtractor,
    private store: Store<SurveyAdminState>,
  ) {
    this.store.select(selectUser).pipe(
      map((user) => {
        this.user = user;
      })
    )
  }

  private user: User | null = null

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('INTERCEPTOR')
    const token = this.tokenExtractor.getToken() as string;
    if (!token) return next.handle(request);
    return next.handle(
      request.clone({
        withCredentials: true,
        headers: request.headers
          //.set(CSRF_HEADER, token)
          .set('AUTHORIZATION', !this.user ? '' : `Bearer ${this.user!.jwt}`)
      })
    );
  }
}
