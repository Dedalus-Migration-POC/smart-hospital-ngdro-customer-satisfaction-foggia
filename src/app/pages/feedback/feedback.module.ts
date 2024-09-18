import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import { DesignAngularKitModule } from 'design-angular-kit'
import { FeedbackRoutingModule } from './feedback-routing.module'
import { FeedbackComponent } from './feedback.component'

@NgModule({
  declarations: [FeedbackComponent],
  imports: [
    CommonModule,
    FeedbackRoutingModule,
    TranslateModule,
    DesignAngularKitModule,
  ],
  exports: [],
})
export class FeedbackModule {}
