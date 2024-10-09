import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {DesignAngularKitModule} from "design-angular-kit";
import {map, Observable} from "rxjs";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MatDialogActions, MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatIcon} from "@angular/material/icon";

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
export class ScaffoldComponent {
  @Input({alias: 'initializing', required: false}) initializing?: boolean;
  @Input({alias: 'pageTitle', required: false}) pageTitle?: string;
  @Input({alias: 'loading', required: true}) loading?: Observable<boolean> | null;
  @Input({alias: 'loadingText', required: false}) loadingText?: string;
  @Input({alias: 'error', required: true}) error?: Observable<boolean> | null;
  @Input({alias: 'errorTitle', required: false}) errorTitle?: string;
  @Input({alias: 'errorText', required: false}) errorText?: string;
  @Output('onErrorRetryCallback') onErrorRetryCallback = new EventEmitter();
  @Output('onErrorCancelCallback') onErrorCancelCallback = new EventEmitter();

  constructor(private activatedRoute: ActivatedRoute) {
    console.log(this.activatedRoute)
    this.activatedRoute.url.subscribe((event) => {
      console.log(event)
    })
  }

  canGoBack$ = this.activatedRoute.url.pipe(map(url => url.length));

}
