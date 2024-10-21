import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent
  },
  {
    path: 'survey-form',
    loadComponent: () => import('./pages/survey-form/survey-form.component').then(module => module.SurveyFormComponent),
  },
  {
    path: 'survey-form/:surveyId',
    pathMatch: 'full',
    loadComponent: () => import('./pages/survey-form/survey-form.component').then(module => module.SurveyFormComponent),
  },
  {
    path: 'section-form',
    loadComponent: () => import('./pages/section-form/section-form.component').then(module => module.SectionFormComponent)
  },
  {
    path: 'section-form/:sectionId',
    pathMatch: 'full',
    loadComponent: () => import('./pages/section-form/section-form.component').then(module => module.SectionFormComponent)
  },
  {
    path: '**',
    component: NotFoundComponent,
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
