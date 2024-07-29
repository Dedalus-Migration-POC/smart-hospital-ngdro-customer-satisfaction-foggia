import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DesignAngularKitModule, provideDesignAngularKit } from 'design-angular-kit';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpBackend } from '@angular/common/http';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DesignAngularKitModule,
    TranslateModule
  ],
  providers: [
    provideDesignAngularKit({
      translateLoader: (itPrefix: string, itSuffix: string) => ({
        provide: TranslateLoader,
        useFactory: (http: HttpBackend) => new MultiTranslateHttpLoader(http, [
          { prefix: itPrefix, suffix: itSuffix }, // Load library translations first, so you can edit the keys in your localization file
          { prefix: './assets/i18n/' }, // Your i18n location
        ]),
        deps: [HttpBackend]
      }),
    }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
