import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AdminRoutingModule} from './admin-routing.module';
import {AdminComponent} from './admin.component';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {HeaderComponent} from "./layout/header/header.component";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {DesignAngularKitModule, provideDesignAngularKit} from "design-angular-kit";
import {LayoutModule} from "../layout/layout.module";
import {APP_BASE_HREF} from "@angular/common";
import {HTTP_INTERCEPTORS, HttpBackend} from "@angular/common/http";
import {MultiTranslateHttpLoader} from "ngx-translate-multi-http-loader";
import {SurveyListComponent} from "./pages/survey-list/survey-list.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {reducer} from "./store/reducer";
import {SurveyEffects} from "./store/effects";
import {CsrfInterceptor} from "./repository/http_interceptors";
import {MatPaginatorIntl} from "@angular/material/paginator";
import {ScaffoldComponent} from "./components/scaffold/scaffold.component";
import {provideAnimations} from "@angular/platform-browser/animations";
import {DateAdapter, MAT_DATE_FORMATS} from "@angular/material/core";
import {AppDateAdapter, MY_FORMATS} from "./config/date-adapter";

@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({'survey': reducer}),
    EffectsModule.forRoot(SurveyEffects),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: false, //environment.production,
    }),
    DesignAngularKitModule,
    TranslateModule,
    LayoutModule,
    AdminRoutingModule,
    MatSlideToggleModule,
    HeaderComponent,
    SurveyListComponent,
    NotFoundComponent,
    ScaffoldComponent
  ],
  providers: [
    MatPaginatorIntl,
    provideAnimations(),
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    {provide: LOCALE_ID, useValue: 'it'},
    {provide: APP_BASE_HREF, useValue: window.location.origin + '/ui/'},
    provideDesignAngularKit({
      translateLoader: (itPrefix: string, itSuffix: string) => ({
        provide: TranslateLoader,
        useFactory: (http: HttpBackend) =>
          new MultiTranslateHttpLoader(http, [
            {prefix: itPrefix, suffix: itSuffix}, // Load library translations first, so you can edit the keys in your localization file
            {prefix: './assets/i18n/'}, // Your i18n location
          ]),
        deps: [HttpBackend],
      }),
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CsrfInterceptor,
      multi: true,
    },
    provideAnimationsAsync(),
  ],
  bootstrap: [AdminComponent]
})
export class AdminModule {
  constructor(private translate: TranslateService, private paginator: MatPaginatorIntl) {
    const matPagPrefix = 'admin.mat-paginator-intl'
    const matPagProperties: Array<keyof MatPaginatorIntl> = ['firstPageLabel',
      'itemsPerPageLabel',
      'lastPageLabel',
      'nextPageLabel',
      'previousPageLabel']
    for (let property of matPagProperties) {
      this.translate.get(`${matPagPrefix}.${property}`).subscribe(label => {
        (this.paginator as any)[property] = label
        this.paginator.changes.next()
      })
    }
    this.translate.get('admin.mat-paginator-intl.rangeLabel').subscribe(label => {
      this.paginator.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return ''; //`0 ${label} 0`
        }
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ?
          Math.min(startIndex + pageSize, length) :
          startIndex + pageSize;

        return `${startIndex + 1} - ${endIndex} ${label} ${length}`;
      }
      this.paginator.changes.next();
    });

  }
}
