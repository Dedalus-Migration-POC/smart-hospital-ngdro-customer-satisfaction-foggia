import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SurveyListComponent} from "./pages/survey-list/survey-list.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SurveyListComponent
  },
  {
    path: 'section',
    loadComponent: () => import('./pages/section-list/section-list.component').then(module => module.SectionListComponent),
  },
  {
    path: 'section/form',
    loadComponent: () => import('./pages/section-form/section-form.component').then(module => module.SectionFormComponent)
  },
  {
    path: 'section/form/:sectionId',
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
