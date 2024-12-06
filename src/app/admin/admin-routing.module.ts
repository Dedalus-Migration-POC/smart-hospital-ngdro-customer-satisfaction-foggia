import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {DashboardComponent} from "./pages/dashboard/admin/dashboard.component";
import {UserRouteGuard} from "./config/user.route-guard";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent,
    canActivate: [UserRouteGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(module => module.LoginComponent),
  },
  {
    path: 'survey-form',
    loadComponent: () =>
      import('./pages/survey-form/survey-form.component').then(({SurveyFormComponent}) => SurveyFormComponent),
  },
  {
    path: 'survey-form/:surveyId/:mode',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/survey-form/survey-form.component').then(({SurveyFormComponent}) => SurveyFormComponent),
  },
  {
    path: 'section-form',
    loadComponent: () =>
      import('./pages/section-form/section-form.component').then(({SectionFormComponent}) => SectionFormComponent)
  },
  {
    path: 'section-form/:sectionId',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/section-form/section-form.component').then(({SectionFormComponent}) => SectionFormComponent)
  },
  {
    path: 'print',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/dashboard/operator/dashboard-operator.component').then(({DashboardOperatorComponent}) => DashboardOperatorComponent)
  },
  {
    path: 'template-form',
    loadComponent: () =>
      import('./pages/template-form/template-form.component').then(({TemplateFormComponent}) => TemplateFormComponent)
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
