import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
  {
    path: 'questionario/:id', //questionario/7veSMcJhW5gOV
    loadChildren: () =>
      import('src/app/pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'questionnaire/:surveyId',
    loadChildren: () =>
      import('src/app/pages/questionnaire/quest.module').then(
        (m) => m.QuestModule,
      ),
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
