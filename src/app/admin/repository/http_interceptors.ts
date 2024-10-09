import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor,} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

const CSRF_HEADER = 'X-XSRF-TOKEN';

@Injectable({providedIn: 'root'})
export class CsrfInterceptor implements HttpInterceptor {
  constructor(private tokenExtractor: HttpXsrfTokenExtractor) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.tokenExtractor.getToken() as string;
    if (!token) return next.handle(request);
    return next.handle(
      request.clone({
        headers: request.headers.set(
          CSRF_HEADER,
          token
        ).set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3Mjc2ODIzMTAsImV4cCI6MTc1OTIxODMxMCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIlJPTEVfQURNSU4iLCJNYW5hZ2VyIl19.xYVDKPBo4L-i300ar74d90a2VayA8-5iYmgvAPhXETQ'),
      })
    );
  }
}
