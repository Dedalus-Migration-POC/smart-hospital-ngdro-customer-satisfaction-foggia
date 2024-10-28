import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
  {
    path: 'survey/:surveyId/:healthcareUnitId/:structure', //survey/1/1/structure
    loadChildren: () =>
      import('src/app/pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'questionnaire',
    loadChildren: () =>
      import('src/app/pages/questionnaire/quest.module').then(
        (m) => m.QuestModule,
      ),
  },
  {
    path: 'feedback',
    loadChildren: () =>
      import('src/app/pages/feedback/feedback.module').then(
        (m) => m.FeedbackModule,
      ),
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
