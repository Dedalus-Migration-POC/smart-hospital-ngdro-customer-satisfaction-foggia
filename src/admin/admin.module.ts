import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { TranslateModule } from '@ngx-translate/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AdminRoutingModule,
    TranslateModule,
    MatSlideToggleModule,
  ],
  providers: [
    provideAnimationsAsync(),
  ],
  bootstrap: [AdminComponent]
})
export class AdminModule { }
