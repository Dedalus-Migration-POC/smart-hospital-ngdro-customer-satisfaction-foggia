import {Inject, Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {APP_BASE_HREF} from "@angular/common";

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  constructor(@Inject(APP_BASE_HREF) private baseUrl: string) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request.clone({
      url: [
        request.url.startsWith('http') ? '' : this.baseUrl,
        request.url.startsWith('http') || request.url.startsWith('/') ? '' : '/',
        request.url,
      ].join('')
    }))
  }
}
