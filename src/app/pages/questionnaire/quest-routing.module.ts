import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { QuestComponent } from './quest.component'

const routes: Routes = [
  {
    path: '',
    component: QuestComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestRoutingModule {}
