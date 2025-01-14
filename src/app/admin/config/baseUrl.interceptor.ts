import { Injectable } from '@angular/core'
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let url
    if (request.url === '/protocol/openid-connect/token') {
      url = 'http://54.155.59.59:5100/realms/foggia_survey-dev' + request.url
    } else {
      url = window.location.origin + request.url
    }
    return next.handle(request.clone({ url: url }))
  }
}
