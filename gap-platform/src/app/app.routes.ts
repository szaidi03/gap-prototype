import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { ProjectSelectionComponent } from './pages/project-selection/project-selection.component';
import { BlueprintConfigComponent } from './pages/blueprint-config/blueprint-config.component';
import { BlueprintStepperComponent } from './pages/blueprint-stepper/blueprint-stepper.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    title: 'Green Accelerator Platform - AI-Enabled Solutions',
  },
  {
    path: 'project-selection',
    component: ProjectSelectionComponent,
    title: 'Phoenix - Select Project Template',
  },
  {
    path: 'blueprint-stepper/:projectId/step/:step',
    component: BlueprintStepperComponent,
    title: 'Configure Blueprint',
  },
  {
    path: 'blueprint-config/:projectId',
    component: BlueprintConfigComponent,
    title: 'Configure Blueprint (Legacy)',
  },
  {
    path: 'generate-blueprint',
    redirectTo: 'project-selection',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
