import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BlueprintStepperService, ProjectCard } from '../../../services/blueprint-stepper.service';

@Component({
  selector: 'app-step-project-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="step-overview" *ngIf="project">
      <div class="step-header">
        <h2 class="step-title">Project Overview</h2>
        <p class="step-description">
          Review your selected project details and confirm your choice before proceeding to configuration.
        </p>
      </div>

      <div class="project-showcase">
        <div class="project-showcase__visual">
          <div class="project-icon" [attr.data-icon]="project.icon" [ngClass]="project.accentClass"></div>
        </div>

        <div class="project-showcase__content">
          <h3 class="project-name">{{ project.title }}</h3>
          <p class="project-description">{{ project.description }}</p>

          <div class="project-features">
            <h4 class="features-title">What you'll get:</h4>
            <ul class="features-list">
              <li class="feature-item" *ngFor="let feature of getProjectFeatures()">
                <span class="material-symbols-outlined feature-icon" aria-hidden="true">check_circle</span>
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>

          <div class="project-technologies">
            <h4 class="technologies-title">Recommended Technologies:</h4>
            <div class="tech-badges">
              <span class="tech-badge" *ngFor="let tech of getRecommendedTechnologies()">
                {{ tech }}
              </span>
            </div>
          </div>

          <div class="project-actions">
            <button type="button" class="btn btn--secondary" (click)="changeProject()">
              <span class="material-symbols-outlined" aria-hidden="true">swap_horiz</span>
              <span>Change Project</span>
            </button>
          </div>
        </div>
      </div>

      <div class="getting-started">
        <h4 class="getting-started__title">Ready to get started?</h4>
        <p class="getting-started__description">
          The next steps will guide you through configuring your {{ project.title }} blueprint with your preferred
          technologies, features, and deployment options.
        </p>

        <div class="next-steps-preview">
          <div class="next-step-item" *ngFor="let step of upcomingSteps">
            <div class="step-preview-icon">
              <span class="material-symbols-outlined" aria-hidden="true">{{ step.icon }}</span>
            </div>
            <div class="step-preview-content">
              <div class="step-preview-title">{{ step.title }}</div>
              <div class="step-preview-description">{{ step.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .step-overview {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .step-header {
      text-align: center;
      max-width: 600px;
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

    .project-showcase {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 2rem;
      padding: 2rem;
      background: #ffffff;
      border: 1px solid rgba(28, 42, 57, 0.08);
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(28, 42, 57, 0.06);
    }

    .project-showcase__visual {
      display: flex;
      align-items: flex-start;
    }

    .project-icon {
      width: 80px;
      height: 80px;
      border-radius: 20px;
      display: grid;
      place-items: center;
      background: rgba(59, 135, 62, 0.12);
      position: relative;
    }

    .project-icon::before {
      content: '';
      width: 40px;
      height: 40px;
      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;
      background: currentColor;
    }

    .project-icon[data-icon='collab-ai'] {
      color: #1c91f0;
      background: rgba(28, 145, 240, 0.12);
    }

    .project-icon[data-icon='comply-sync'] {
      color: #3b873e;
      background: rgba(59, 135, 62, 0.12);
    }

    .project-icon[data-icon='hephaestus'] {
      color: #ea6b1f;
      background: rgba(234, 107, 31, 0.12);
    }

    .project-icon[data-icon='agados'] {
      color: #6e6bce;
      background: rgba(110, 107, 206, 0.12);
    }

    .project-icon[data-icon='collab-ai']::before {
      mask-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpath d="M12 3v18"/%3E%3Cpath d="M3 12h18"/%3E%3Cpath d="M6.5 6.5l11 11"/%3E%3Cpath d="M6.5 17.5l11-11"/%3E%3C/svg%3E');
    }

    .project-icon[data-icon='comply-sync']::before {
      mask-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpath d="M3.5 5.5L9 11l4-4 7.5 7.5"/%3E%3Cpath d="M20.5 13.5V19H5"/%3E%3C/svg%3E');
    }

    .project-icon[data-icon='hephaestus']::before {
      mask-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpath d="M12 2l2.09 6.26L20 9l-5 3.64L16.18 20 12 16.9 7.82 20 9 12.64 4 9l5.91-.74L12 2z"/%3E%3C/svg%3E');
    }

    .project-icon[data-icon='agados']::before {
      mask-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpath d="M12 3a9 9 0 1 0 9 9"/%3E%3Cpath d="M3 12h18"/%3E%3Cpath d="M12 3v18"/%3E%3C/svg%3E');
    }

    .project-showcase__content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .project-name {
      font-size: 1.75rem;
      font-weight: 600;
      color: #1c2a39;
      margin: 0;
    }

    .project-description {
      font-size: 1rem;
      color: #4f5a68;
      line-height: 1.6;
      margin: 0;
    }

    .features-title,
    .technologies-title {
      font-size: 1rem;
      font-weight: 600;
      color: #1c2a39;
      margin: 0 0 0.75rem 0;
    }

    .features-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #4f5a68;
    }

    .feature-icon {
      color: #3b873e;
      font-size: 1.125rem;
    }

    .tech-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tech-badge {
      padding: 0.375rem 0.75rem;
      background: rgba(59, 135, 62, 0.1);
      color: #3b873e;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .project-actions {
      margin-top: auto;
      padding-top: 0.5rem;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn--secondary {
      background: rgba(28, 42, 57, 0.08);
      color: #4f5a68;
    }

    .btn--secondary:hover {
      background: rgba(28, 42, 57, 0.12);
    }

    .getting-started {
      background: linear-gradient(135deg, rgba(59, 135, 62, 0.05) 0%, rgba(59, 135, 62, 0.02) 100%);
      border: 1px solid rgba(59, 135, 62, 0.1);
      border-radius: 16px;
      padding: 2rem;
    }

    .getting-started__title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1c2a39;
      margin: 0 0 0.75rem 0;
      text-align: center;
    }

    .getting-started__description {
      font-size: 1rem;
      color: #4f5a68;
      line-height: 1.6;
      margin: 0 0 2rem 0;
      text-align: center;
    }

    .next-steps-preview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .next-step-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid rgba(28, 42, 57, 0.06);
    }

    .step-preview-icon {
      width: 32px;
      height: 32px;
      background: rgba(59, 135, 62, 0.1);
      color: #3b873e;
      border-radius: 8px;
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }

    .step-preview-icon .material-symbols-outlined {
      font-size: 1.125rem;
    }

    .step-preview-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1c2a39;
      margin-bottom: 0.25rem;
    }

    .step-preview-description {
      font-size: 0.75rem;
      color: #4f5a68;
      line-height: 1.4;
    }

    @media (max-width: 768px) {
      .project-showcase {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        text-align: center;
      }

      .project-showcase__visual {
        justify-content: center;
      }

      .next-steps-preview {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StepProjectOverviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  project: ProjectCard | null = null;

  readonly upcomingSteps = [
    {
      icon: 'architecture',
      title: 'Architecture',
      description: 'Choose application types and patterns'
    },
    {
      icon: 'code',
      title: 'Technology Stack',
      description: 'Select frameworks and technologies'
    },
    {
      icon: 'extension',
      title: 'Features',
      description: 'Configure features and integrations'
    }
  ];

  constructor(
    private stepperService: BlueprintStepperService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.stepperService.configuration$
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        this.project = config.project;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getProjectFeatures(): string[] {
    if (!this.project) return [];

    const commonFeatures = [
      'Complete project structure and scaffolding',
      'Best practice architecture patterns',
      'Comprehensive documentation',
      'Development environment setup'
    ];

    const projectSpecificFeatures: { [key: string]: string[] } = {
      'collab-ai': [
        'AI/ML integration patterns',
        'Collaborative workspace features',
        'Enterprise-grade security',
        'Analytics and insights dashboard'
      ],
      'comply-sync': [
        'Compliance management framework',
        'FedRAMP baseline configurations',
        'Automated compliance reporting',
        'Control mapping utilities'
      ],
      'hephaestus': [
        'Platform service architecture',
        'Interoperability frameworks',
        'Scalable microservices design',
        'API gateway configuration'
      ],
      'agados': [
        'Project management workflows',
        'Collaboration tools integration',
        'Clean energy domain models',
        'Automated project tracking'
      ]
    };

    return [...commonFeatures, ...(projectSpecificFeatures[this.project.id] || [])];
  }

  getRecommendedTechnologies(): string[] {
    if (!this.project) return [];

    const recommendedTech: { [key: string]: string[] } = {
      'collab-ai': ['React', 'Node.js', 'PostgreSQL', 'TensorFlow', 'Docker'],
      'comply-sync': ['Angular', 'Spring Boot', 'MongoDB', 'OAuth 2.0', 'Kubernetes'],
      'hephaestus': ['Vue.js', 'Microservices', 'Redis', 'GraphQL', 'AWS'],
      'agados': ['Next.js', 'Express.js', 'MySQL', 'WebSocket', 'Azure']
    };

    return recommendedTech[this.project.id] || ['React', 'Node.js', 'PostgreSQL', 'Docker'];
  }

  changeProject(): void {
    this.router.navigate(['/project-selection']);
  }
}