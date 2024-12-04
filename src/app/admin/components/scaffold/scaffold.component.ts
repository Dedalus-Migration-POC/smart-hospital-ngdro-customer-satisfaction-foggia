import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {DesignAngularKitModule} from "design-angular-kit";
import {BehaviorSubject, map, Observable} from "rxjs";
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from "@angular/router";
import {MatDialogActions, MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatIcon} from "@angular/material/icon";
import {Store} from "@ngrx/store";
import {SurveyAdminState} from "../../store/store";
import {withLatestFrom} from "rxjs/operators";

@Component({
  selector: 'app-scaffold',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    DesignAngularKitModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    NgOptimizedImage,
    MatButton,
    MatProgressSpinner,
    MatIcon,
    RouterLink,
  ],
  templateUrl: './scaffold.component.html',
  styleUrl: './scaffold.component.scss'
})
export class ScaffoldComponent implements OnInit {
  @Input({alias: 'initializing', required: false}) initializing?: boolean;
  @Input({alias: 'pageTitle', required: false}) pageTitle?: string;
  @Input({alias: 'loading', required: true}) loading?: Observable<boolean> | null;
  @Input({alias: 'loadingText', required: false}) loadingText?: string;
  @Input({alias: 'error', required: true}) error?: Observable<boolean> | null;
  @Input({alias: 'errorTitle', required: false}) errorTitle?: string;
  @Input({alias: 'errorText', required: false}) errorText?: string;
  @Output('onErrorRetryCallback') onErrorRetryCallback: EventEmitter<any> = new EventEmitter();
  @Output('onErrorCancelCallback') onErrorCancelCallback: EventEmitter<any> | undefined;

  constructor(
    private store: Store<SurveyAdminState>,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.router.events.subscribe(
      event => {
        if (event instanceof NavigationEnd) {
          // Get the current route stack
          const routeStack = this.getRouteStack(event);
          this.canShowBackLink$.next(!!routeStack.length)
        }
      }
    )
    if (this.onErrorCancelCallback) {
      this.onErrorCancelCallback = new EventEmitter()
    }
  }

  getRouteStack(event: NavigationEnd): ActivatedRoute[] {
    const routeStack: ActivatedRoute[] = [];
    let currentRoute = event.urlAfterRedirects;
    console.log(event.urlAfterRedirects, routeStack)
    while (currentRoute) {
      //@ts-ignore
      routeStack.unshift(currentRoute);
      //@ts-ignore
      currentRoute = currentRoute.parent;
    }
    return routeStack;
  }

  initializing$ = this.store.select(s => s.application.initializing)
  canShowBackLink$ = new BehaviorSubject(false)
  canGoBack$ = this.activatedRoute.url.pipe(
    withLatestFrom(this.initializing$),
    map(([url, initializing]) => !initializing && url.length)
  );

}
