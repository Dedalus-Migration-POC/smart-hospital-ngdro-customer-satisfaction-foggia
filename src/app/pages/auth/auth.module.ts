import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AuthComponent } from './auth.component'
import { ReactiveFormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { DesignAngularKitModule } from 'design-angular-kit'
import { AuthRoutingModule } from './auth-routing.module'
import { OtpCardComponent } from 'src/app/components/otp-card/otp-card.component'
import { LoadingFullScreenComponent } from 'src/app/components/loading-full-screen/loading-full-screen.component'

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    DesignAngularKitModule,
    OtpCardComponent,
    LoadingFullScreenComponent,
  ],
  exports: [],
})
export class AuthModule {}
