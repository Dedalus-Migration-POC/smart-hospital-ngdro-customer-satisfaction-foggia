import { Injectable } from '@angular/core'
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let url
    if (request.url === '/protocol/openid-connect/token') {
      url = environment.keycloakEndpoint + request.url
    } else {
      url = window.location.origin + request.url
    }
    return next.handle(request.clone({ url: url }))
  }
}
