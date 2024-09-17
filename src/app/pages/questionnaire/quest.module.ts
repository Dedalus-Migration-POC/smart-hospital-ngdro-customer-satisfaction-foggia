import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { DesignAngularKitModule } from 'design-angular-kit'
import { QuestComponent } from './quest.component'
import { QuestRoutingModule } from './quest-routing.module'
import { QuestListComponent } from 'src/app/components/quest-list/quest-list.component'

@NgModule({
  declarations: [QuestComponent],
  imports: [
    CommonModule,
    QuestRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    DesignAngularKitModule,
    QuestListComponent,
  ],
  exports: [],
})
export class QuestModule {}
