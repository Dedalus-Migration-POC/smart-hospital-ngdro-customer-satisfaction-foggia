import {Injectable, Injector} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {SurveyAdminState} from "../store/store";
import {Router} from "@angular/router";
import {User} from "../repository/dto/user";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private injector: Injector,
              private store: Store<SurveyAdminState>,
              private router: Router,
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('AuthInterceptor.intercept')
    const record = window.localStorage.getItem("profile");
    if (record) {
      const user = JSON.parse(record) as User
      return next.handle(request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + user.jwt)
      }))
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
}
