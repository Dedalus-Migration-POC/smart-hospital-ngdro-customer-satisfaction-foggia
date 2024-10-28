import {NgModule} from '@angular/core';
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
import {MatPaginatorIntl} from "@angular/material/paginator";
import {ScaffoldComponent} from "./components/scaffold/scaffold.component";
import {provideAnimations} from "@angular/platform-browser/animations";
import {APP_DATE_FORMATS} from "./config/date-adapter";
import {effects, reducers} from "./store/store";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {AuthInterceptor} from "./config/auth.interceptor";

@NgModule({
  declarations: [
    AdminComponent,
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),
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
    {provide: MAT_DATE_LOCALE, useValue: 'it'},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
    {provide: DateAdapter, useClass: MomentDateAdapter},
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
    {provide: APP_BASE_HREF, useValue: window.location.origin + '/ui/'},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
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
