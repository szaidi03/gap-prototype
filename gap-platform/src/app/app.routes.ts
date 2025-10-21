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
  // Phoenix routes
  {
    path: 'phoenix',
    component: ProjectSelectionComponent,
    title: 'Phoenix - Select Project Template',
  },
  {
    path: 'phoenix/project-selection',
    redirectTo: 'phoenix',
  },
  // Individual project routes
  {
    path: 'collab-ai',
    redirectTo: 'phoenix',
  },
  {
    path: 'collab-ai/blueprint-stepper/:projectId/step/:step',
    component: BlueprintStepperComponent,
    title: 'CollabAI - Configure Blueprint',
  },
  {
    path: 'comply-sync',
    redirectTo: 'phoenix',
  },
  {
    path: 'comply-sync/blueprint-stepper/:projectId/step/:step',
    component: BlueprintStepperComponent,
    title: 'ComplySync - Configure Blueprint',
  },
  {
    path: 'hephaestus',
    redirectTo: 'phoenix',
  },
  {
    path: 'hephaestus/blueprint-stepper/:projectId/step/:step',
    component: BlueprintStepperComponent,
    title: 'Hephaestus - Configure Blueprint',
  },
  {
    path: 'agados',
    redirectTo: 'phoenix',
  },
  {
    path: 'agados/blueprint-stepper/:projectId/step/:step',
    component: BlueprintStepperComponent,
    title: 'Agados - Configure Blueprint',
  },
  {
    path: 'grants',
    redirectTo: 'phoenix',
  },
  {
    path: 'debt',
    redirectTo: 'phoenix',
  },
  {
    path: 'athena',
    redirectTo: 'phoenix',
  },
  {
    path: 'argus',
    redirectTo: 'phoenix',
  },
  // Legacy routes for backwards compatibility
  {
    path: 'project-selection',
    redirectTo: 'phoenix',
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
    redirectTo: 'phoenix',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
