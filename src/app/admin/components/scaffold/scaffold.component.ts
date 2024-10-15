import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {DesignAngularKitModule} from "design-angular-kit";
import {map, Observable} from "rxjs";
import {ActivatedRoute, RouterLink} from "@angular/router";
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
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    if (this.onErrorCancelCallback) {
      this.onErrorCancelCallback = new EventEmitter()
    }
  }

  initializing$ = this.store.select(s => s.application.initializing)
  canGoBack$ = this.activatedRoute.url.pipe(
    withLatestFrom(this.initializing$),
    map(([url, initializing]) => !initializing && url.length)
  );

}
