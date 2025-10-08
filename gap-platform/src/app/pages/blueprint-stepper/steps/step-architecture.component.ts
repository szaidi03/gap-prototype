import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BlueprintStepperService, ArchitectureConfig } from '../../../services/blueprint-stepper.service';

interface ProjectType {
  id: string;
  label: string;
  description: string;
  icon: string;
  frameworks?: string[];
}


@Component({
  selector: 'app-step-architecture',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step-architecture">
      <div class="step-header">
        <h2 class="step-title">Application Type</h2>
        <p class="step-description">
          Choose the type of web application you want to build and select a deployment pattern
          that best fits your project requirements.
        </p>
      </div>

      <div class="architecture-sections">
        <!-- Project Types Selection -->
        <section class="config-section">
          <h3 class="section-title">
            Application Types
            <span class="required-indicator">*</span>
          </h3>
          <p class="section-description">
            Select the types of web applications you want to generate. You can choose both frontend and backend for a full-stack application.
          </p>

          <div class="project-types-grid">
            <label
              *ngFor="let type of projectTypes"
              class="project-type-card"
              [class.selected]="isProjectTypeSelected(type.id)"
            >
              <input
                type="checkbox"
                [checked]="isProjectTypeSelected(type.id)"
                (change)="onProjectTypeChange(type.id, $any($event.target).checked)"
                class="project-type-input"
              />
              <div class="project-type-content">
                <div class="project-type-header">
                  <span class="material-symbols-outlined project-type-icon" aria-hidden="true">{{ type.icon }}</span>
                  <h4 class="project-type-title">{{ type.label }}</h4>
                </div>
                <p class="project-type-description">{{ type.description }}</p>
                <div class="project-type-frameworks" *ngIf="type.frameworks && type.frameworks.length > 0">
                  <span class="framework-label">Popular frameworks:</span>
                  <span class="framework-tags">
                    <span class="framework-tag" *ngFor="let fw of type.frameworks">{{ fw }}</span>
                  </span>
                </div>
              </div>
              <div class="selection-indicator">
                <span class="material-symbols-outlined" aria-hidden="true">check</span>
              </div>
            </label>
          </div>

          <div class="validation-message" *ngIf="showProjectTypeError">
            <span class="material-symbols-outlined" aria-hidden="true">error</span>
            <span>Please select at least one application type</span>
          </div>
        </section>


        <!-- Configuration Summary -->
        <section class="config-section" *ngIf="config.projectTypes.length > 0">
          <h3 class="section-title">Configuration Summary</h3>
          <div class="config-summary">
            <div class="summary-item">
              <span class="summary-label">Application Types:</span>
              <div class="summary-tags">
                <span class="summary-tag" *ngFor="let type of getSelectedProjectTypes()">
                  {{ type.label }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .step-architecture {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .step-header {
      text-align: center;
      max-width: 700px;
      margin: 0 auto;
    }

    .step-title {
      font-size: 2rem;
      font-weight: 600;
      color: #1c2a39;
      margin: 0 0 1rem 0;
    }

    .step-description {
      font-size: 1.125rem;
      color: #4f5a68;
      line-height: 1.6;
      margin: 0;
    }

    .architecture-sections {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .config-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .section-title {
      font-size: 1.375rem;
      font-weight: 600;
      color: #1c2a39;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .required-indicator {
      color: #e74c3c;
      font-weight: 500;
    }

    .section-description {
      font-size: 1rem;
      color: #4f5a68;
      line-height: 1.6;
      margin: 0;
    }

    .project-types-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }

    .project-type-card {
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      border: 2px solid rgba(28, 42, 57, 0.08);
      border-radius: 16px;
      background: #ffffff;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }

    .project-type-card:hover {
      border-color: rgba(59, 135, 62, 0.2);
      background: rgba(59, 135, 62, 0.02);
    }

    .project-type-card.selected {
      border-color: #3b873e;
      background: rgba(59, 135, 62, 0.05);
    }

    .project-type-input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .project-type-content {
      flex-grow: 1;
    }

    .project-type-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .project-type-icon {
      font-size: 1.5rem;
      color: #3b873e;
    }

    .project-type-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1c2a39;
      margin: 0;
    }

    .project-type-description {
      font-size: 0.875rem;
      color: #4f5a68;
      line-height: 1.5;
      margin: 0 0 1rem 0;
    }

    .project-type-frameworks {
      margin-top: auto;
    }

    .framework-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #4f5a68;
      display: block;
      margin-bottom: 0.5rem;
    }

    .framework-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .framework-tag {
      padding: 0.25rem 0.5rem;
      background: rgba(59, 135, 62, 0.1);
      color: #3b873e;
      border-radius: 12px;
      font-size: 0.6875rem;
      font-weight: 500;
    }

    .selection-indicator {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 24px;
      height: 24px;
      border: 2px solid rgba(28, 42, 57, 0.2);
      border-radius: 6px;
      background: #ffffff;
      display: grid;
      place-items: center;
      transition: all 0.2s ease;
    }

    .project-type-card.selected .selection-indicator {
      background: #3b873e;
      border-color: #3b873e;
      color: #ffffff;
    }

    .selection-indicator .material-symbols-outlined {
      font-size: 16px;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .project-type-card.selected .selection-indicator .material-symbols-outlined {
      opacity: 1;
    }

    .architecture-patterns {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }

    .pattern-card {
      display: flex;
      padding: 1.5rem;
      border: 2px solid rgba(28, 42, 57, 0.08);
      border-radius: 16px;
      background: #ffffff;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }

    .pattern-card:hover {
      border-color: rgba(59, 135, 62, 0.2);
      background: rgba(59, 135, 62, 0.02);
    }

    .pattern-card.selected {
      border-color: #3b873e;
      background: rgba(59, 135, 62, 0.05);
    }

    .pattern-input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .pattern-content {
      flex-grow: 1;
    }

    .pattern-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1c2a39;
      margin: 0 0 0.5rem 0;
    }

    .pattern-description {
      font-size: 0.875rem;
      color: #4f5a68;
      line-height: 1.5;
      margin: 0 0 1rem 0;
    }

    .pattern-best-for {
      margin-top: auto;
    }

    .best-for-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #4f5a68;
      display: block;
      margin-bottom: 0.5rem;
    }

    .best-for-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .best-for-list li {
      font-size: 0.75rem;
      color: #4f5a68;
      position: relative;
      padding-left: 1rem;
    }

    .best-for-list li::before {
      content: '•';
      color: #3b873e;
      position: absolute;
      left: 0;
    }

    .validation-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: rgba(231, 76, 60, 0.1);
      border: 1px solid rgba(231, 76, 60, 0.2);
      border-radius: 8px;
      color: #c0392b;
      font-size: 0.875rem;
    }

    .validation-message .material-symbols-outlined {
      font-size: 1.125rem;
    }

    .config-summary {
      padding: 1.5rem;
      background: rgba(59, 135, 62, 0.05);
      border: 1px solid rgba(59, 135, 62, 0.1);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .summary-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .summary-label {
      font-weight: 600;
      color: #1c2a39;
      min-width: 140px;
      font-size: 0.875rem;
    }

    .summary-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .summary-tag {
      padding: 0.25rem 0.75rem;
      background: #3b873e;
      color: #ffffff;
      border-radius: 16px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .summary-value {
      font-size: 0.875rem;
      color: #4f5a68;
    }

    @media (max-width: 768px) {
      .project-types-grid,
      .architecture-patterns {
        grid-template-columns: 1fr;
      }

      .summary-item {
        flex-direction: column;
        gap: 0.5rem;
      }

      .summary-label {
        min-width: unset;
      }
    }
  `]
})
export class StepArchitectureComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  config: ArchitectureConfig = {
    projectTypes: [],
    frameworks: {}
  };

  showProjectTypeError = false;

  readonly projectTypes: ProjectType[] = [
    {
      id: 'frontend',
      label: 'Frontend Application',
      description: 'User-facing web application with modern UI/UX',
      icon: 'web',
      frameworks: ['React', 'Angular', 'Vue.js', 'Svelte']
    },
    {
      id: 'backend',
      label: 'Backend API',
      description: 'Server-side application providing APIs and business logic',
      icon: 'dns',
      frameworks: ['Node.js', 'Django', 'Spring Boot', '.NET Core']
    }
  ];


  constructor(private stepperService: BlueprintStepperService) {}

  ngOnInit(): void {
    this.stepperService.configuration$
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        this.config = { ...config.architecture };
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isProjectTypeSelected(projectType: string): boolean {
    return this.config.projectTypes.includes(projectType);
  }

  onProjectTypeChange(projectType: string, checked: boolean): void {
    if (checked) {
      if (!this.config.projectTypes.includes(projectType)) {
        this.config.projectTypes.push(projectType);
      }
    } else {
      this.config.projectTypes = this.config.projectTypes.filter(type => type !== projectType);
    }

    this.showProjectTypeError = false;
    this.updateConfiguration();
  }


  getSelectedProjectTypes(): ProjectType[] {
    return this.projectTypes.filter(type => this.config.projectTypes.includes(type.id));
  }


  private updateConfiguration(): void {
    this.stepperService.updateArchitecture(this.config);

    // Validate current step
    const validation = this.stepperService.validateStep(3);
    this.showProjectTypeError = validation.errors.includes('Please select at least one application type');
  }
}