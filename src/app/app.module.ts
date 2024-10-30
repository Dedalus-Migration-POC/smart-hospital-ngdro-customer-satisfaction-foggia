import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import {
  DesignAngularKitModule,
  provideDesignAngularKit,
} from 'design-angular-kit'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import {
  HTTP_INTERCEPTORS,
  HttpBackend,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http'
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { effects } from './store/effects'
import { metaReducers, reducers } from './store/reducers'
import { LayoutModule } from './layout/layout.module'
import { APP_BASE_HREF } from '@angular/common'
import { BaseUrlInterceptor } from './utils/baseUrl.interceptor'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: false, //environment.production,
    }),
    AppRoutingModule,
    DesignAngularKitModule,
    TranslateModule,
    LayoutModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: APP_BASE_HREF, useValue: window.location.origin + '/ui/' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true,
    },
    provideDesignAngularKit({
      translateLoader: (itPrefix: string, itSuffix: string) => ({
        provide: TranslateLoader,
        useFactory: (http: HttpBackend) =>
          new MultiTranslateHttpLoader(http, [
            { prefix: itPrefix, suffix: itSuffix }, // Load library translations first, so you can edit the keys in your localization file
            { prefix: './assets/i18n/' }, // Your i18n location
          ]),
        deps: [HttpBackend],
      }),
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
