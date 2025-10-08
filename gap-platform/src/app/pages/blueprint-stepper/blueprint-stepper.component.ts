import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BlueprintStepperService, ProjectCard } from '../../services/blueprint-stepper.service';
import { StepProjectOverviewComponent } from './steps/step-project-overview.component';
import { StepMetadataComponent } from './steps/step-metadata.component';
import { StepArchitectureComponent } from './steps/step-architecture.component';
import { StepTechnologyStackComponent } from './steps/step-technology-stack.component';
import { StepFeaturesComponent } from './steps/step-features.component';
import { StepDevToolsComponent } from './steps/step-dev-tools.component';
import { StepReviewComponent } from './steps/step-review.component';

@Component({
  selector: 'app-blueprint-stepper',
  standalone: true,
  imports: [
    CommonModule,
    StepProjectOverviewComponent,
    StepMetadataComponent,
    StepArchitectureComponent,
    StepTechnologyStackComponent,
    StepFeaturesComponent,
    StepDevToolsComponent,
    StepReviewComponent
  ],
  templateUrl: './blueprint-stepper.component.html',
  styleUrls: ['./blueprint-stepper.component.scss'],
})
export class BlueprintStepperComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentStep = 1;
  project: ProjectCard | null = null;

  readonly projects: ProjectCard[] = [
    {
      id: 'collab-ai',
      title: 'CollabAI',
      description: 'Application that integrates with CollabWise to produce actionable insights across the enterprise.',
      icon: 'collab-ai',
      accentClass: 'accent-blue',
    },
    {
      id: 'comply-sync',
      title: 'ComplySync ATO',
      description: 'Accelerating Authority to Operate by connecting controls data to Manage Once! FedRAMP compliant baseline.',
      icon: 'comply-sync',
      accentClass: 'accent-green',
    },
    {
      id: 'hephaestus',
      title: 'Hephaestus',
      description: 'Application Platform Services with FedRAMP/StateRAMP interoperability resources.',
      icon: 'hephaestus',
      accentClass: 'accent-orange',
    },
    {
      id: 'agados',
      title: 'Agados',
      description: 'Provides an integrated suite of collaboration and automation tools to manage Clean Energy projects.',
      icon: 'agados',
      accentClass: 'accent-purple',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public stepperService: BlueprintStepperService
  ) {}

  ngOnInit(): void {
    // Get project ID from route
    const projectId = this.route.snapshot.paramMap.get('projectId');
    if (projectId) {
      this.project = this.projects.find(p => p.id === projectId) || null;
      if (this.project) {
        this.stepperService.setProject(this.project);
      }
    }

    // Get step from route
    const stepParam = this.route.snapshot.paramMap.get('step');
    if (stepParam) {
      const stepNumber = parseInt(stepParam, 10);
      if (stepNumber >= 1 && stepNumber <= 7) {
        this.stepperService.goToStep(stepNumber);
      }
    }

    // Subscribe to current step changes
    this.stepperService.currentStep$
      .pipe(takeUntil(this.destroy$))
      .subscribe(step => {
        this.currentStep = step;
      });

    // Subscribe to configuration changes
    this.stepperService.configuration$
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        this.project = config.project;
      });

    // If no project found, redirect to project selection
    if (!this.project && !projectId) {
      this.router.navigate(['/project-selection']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onStepClick(stepNumber: number): void {
    if (this.stepperService.isStepAccessible(stepNumber)) {
      this.stepperService.goToStep(stepNumber);
      this.updateRoute();
    }
  }

  onNextStep(): void {
    if (this.stepperService.nextStep()) {
      this.updateRoute();
    }
  }

  onPreviousStep(): void {
    if (this.stepperService.previousStep()) {
      this.updateRoute();
    }
  }

  onBackToProjects(): void {
    this.router.navigate(['/project-selection']);
  }

  canProceedToNext(): boolean {
    return this.stepperService.canProceedToNextStep();
  }

  canGoBack(): boolean {
    return this.currentStep > 1;
  }

  isLastStep(): boolean {
    return this.currentStep === 7;
  }

  private updateRoute(): void {
    if (this.project) {
      this.router.navigate(['/blueprint-stepper', this.project.id, 'step', this.currentStep]);
    }
  }

  getStepStatus(stepNumber: number): 'completed' | 'current' | 'upcoming' | 'disabled' {
    const step = this.stepperService.steps[stepNumber - 1];

    if (stepNumber < this.currentStep && step.isCompleted) {
      return 'completed';
    }

    if (stepNumber === this.currentStep) {
      return 'current';
    }

    if (this.stepperService.isStepAccessible(stepNumber)) {
      return 'upcoming';
    }

    return 'disabled';
  }
}