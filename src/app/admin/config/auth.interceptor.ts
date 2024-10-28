import {Injectable, Injector} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, switchMap} from "rxjs";
import {Store} from "@ngrx/store";
import {SurveyAdminState} from "../store/store";
import {selectUser} from "../store/application/reducer";
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private injector: Injector,
              private store: Store<SurveyAdminState>,
              private router: Router,
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('AuthInterceptor.intercept')
    return this.store.select(selectUser).pipe(
      switchMap((user) => {
          if (!user) {
            console.log('NO USER')
            this.router.navigate(["/login"]).then(r => r);
          }
          console.log('USER FOUND', user)
          return next.handle(request)
        }
      ))
  }
}
