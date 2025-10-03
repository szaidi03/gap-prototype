import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';

export const routes: Routes = [
  {
    path: 'generate-blueprint',
    component: LandingComponent,
    title: 'Generate Blueprint',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'generate-blueprint',
  },
  {
    path: '**',
    redirectTo: 'generate-blueprint',
  },
];
