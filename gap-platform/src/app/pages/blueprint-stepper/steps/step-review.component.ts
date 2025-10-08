import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { BlueprintStepperService, BlueprintConfiguration } from '../../../services/blueprint-stepper.service';

@Component({
  selector: 'app-step-review',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="step-review">
      <div class="step-header">
        <h2 class="step-title">Review & Generate Blueprint</h2>
        <p class="step-description">Review your configuration and generate your customized blueprint.</p>
      </div>

      <div class="review-sections" *ngIf="config">
        <!-- Project Info -->
        <div class="review-section">
          <h3 class="section-title">Project Information</h3>
          <div class="review-card">
            <div class="project-summary">
              <div class="project-icon" [attr.data-icon]="config.project?.icon" [ngClass]="config.project?.accentClass"></div>
              <div>
                <h4>{{ config.project?.title }}</h4>
                <p>{{ config.project?.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Architecture -->
        <div class="review-section">
          <h3 class="section-title">Architecture Configuration</h3>
          <div class="review-card">
            <div class="config-row">
              <span class="config-label">Application Types:</span>
              <div class="config-tags">
                <span class="config-tag" *ngFor="let type of config.architecture.projectTypes">{{ formatProjectType(type) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Technology Stack -->
        <div class="review-section" *ngIf="hasTechnologyStack()">
          <h3 class="section-title">Technology Stack</h3>
          <div class="review-card">
            <div class="tech-stack-grid">
              <div class="tech-stack-item" *ngIf="config.technologyStack.frontend.framework">
                <h4>Frontend</h4>
                <div class="tech-list">
                  <span class="tech-item">{{ config.technologyStack.frontend.framework }}</span>
                  <span class="tech-item" *ngIf="config.technologyStack.frontend.uiLibrary">{{ config.technologyStack.frontend.uiLibrary }}</span>
                </div>
              </div>
              <div class="tech-stack-item" *ngIf="config.technologyStack.backend.framework">
                <h4>Backend</h4>
                <div class="tech-list">
                  <span class="tech-item">{{ config.technologyStack.backend.framework }}</span>
                  <span class="tech-item" *ngIf="config.technologyStack.backend.database">{{ config.technologyStack.backend.database }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Features -->
        <div class="review-section" *ngIf="hasFeatures()">
          <h3 class="section-title">Features & Integrations</h3>
          <div class="review-card">
            <div class="feature-summary">
              <div class="feature-item" *ngIf="config.features.authentication.enabled">
                <span class="material-symbols-outlined">security</span>
                <span>Authentication ({{ config.features.authentication.methods.length }} methods)</span>
              </div>
              <div class="feature-item" *ngIf="config.features.database.enabled">
                <span class="material-symbols-outlined">database</span>
                <span>Database Integration</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Development Tools -->
        <div class="review-section" *ngIf="hasDevTools()">
          <h3 class="section-title">Development Tools</h3>
          <div class="review-card">
            <div class="tools-summary">
              <div class="tool-category" *ngIf="config.devTools.testing.enabled">
                <span class="tool-label">Testing:</span>
                <span class="tool-count">{{ config.devTools.testing.frameworks.length }} frameworks</span>
              </div>
              <div class="tool-category" *ngIf="config.devTools.codeQuality.enabled">
                <span class="tool-label">Code Quality:</span>
                <span class="tool-count">{{ config.devTools.codeQuality.tools.length }} tools</span>
              </div>
              <div class="tool-category" *ngIf="config.devTools.documentation.enabled">
                <span class="tool-label">Documentation:</span>
                <span class="tool-count">{{ config.devTools.documentation.tools.length }} tools</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Deployment -->
        <div class="review-section" *ngIf="hasDeployment()">
          <h3 class="section-title">Deployment & DevOps</h3>
          <div class="review-card">
            <div class="deployment-summary">
              <div class="deploy-item" *ngIf="config.deployment.containerization.enabled">
                <span class="material-symbols-outlined">developer_board</span>
                <span>Containerization</span>
              </div>
              <div class="deploy-item" *ngIf="config.deployment.cicd.enabled">
                <span class="material-symbols-outlined">sync</span>
                <span>CI/CD Pipeline</span>
              </div>
              <div class="deploy-item" *ngIf="config.deployment.cloudProvider.enabled">
                <span class="material-symbols-outlined">cloud</span>
                <span>Cloud Deployment</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Generation Options -->
        <div class="generation-section">
          <h3 class="section-title">Blueprint Generation</h3>
          <div class="generation-card">
            <div class="generation-options">
              <div class="generation-item">
                <span class="material-symbols-outlined">folder_open</span>
                <div>
                  <h4>Complete Project Structure</h4>
                  <p>Scaffolded directories, configuration files, and boilerplate code</p>
                </div>
              </div>
              <div class="generation-item">
                <span class="material-symbols-outlined">description</span>
                <div>
                  <h4>Documentation</h4>
                  <p>README, setup instructions, and architectural documentation</p>
                </div>
              </div>
              <div class="generation-item">
                <span class="material-symbols-outlined">build</span>
                <div>
                  <h4>Build Configuration</h4>
                  <p>Build scripts, package configuration, and environment setup</p>
                </div>
              </div>
            </div>

            <button class="generate-button" (click)="generateBlueprint()">
              <span class="material-symbols-outlined">auto_awesome</span>
              <span>Generate {{ config.project?.title }} Blueprint</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .step-review {
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

    .review-sections {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .review-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .section-title {
      font-size: 1.375rem;
      font-weight: 600;
      color: #1c2a39;
      margin: 0;
    }

    .review-card {
      background: #ffffff;
      border: 1px solid rgba(28, 42, 57, 0.08);
      border-radius: 16px;
      padding: 1.5rem;
    }

    .project-summary {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .project-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: grid;
      place-items: center;
      position: relative;
      flex-shrink: 0;
    }

    .project-icon::before {
      content: '';
      width: 24px;
      height: 24px;
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

    .project-summary h4 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1c2a39;
      margin: 0 0 0.25rem 0;
    }

    .project-summary p {
      font-size: 0.875rem;
      color: #4f5a68;
      margin: 0;
    }

    .config-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .config-row:last-child {
      margin-bottom: 0;
    }

    .config-label {
      font-weight: 600;
      color: #1c2a39;
      min-width: 140px;
      font-size: 0.875rem;
    }

    .config-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .config-tag {
      padding: 0.25rem 0.75rem;
      background: #3b873e;
      color: #ffffff;
      border-radius: 16px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .config-value {
      font-size: 0.875rem;
      color: #4f5a68;
    }

    .tech-stack-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .tech-stack-item h4 {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1c2a39;
      margin: 0 0 0.5rem 0;
    }

    .tech-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .tech-item {
      padding: 0.25rem 0.5rem;
      background: rgba(59, 135, 62, 0.1);
      color: #3b873e;
      border-radius: 12px;
      font-size: 0.6875rem;
      font-weight: 500;
    }

    .feature-summary,
    .deployment-summary {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .feature-item,
    .deploy-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #4f5a68;
    }

    .feature-item .material-symbols-outlined,
    .deploy-item .material-symbols-outlined {
      color: #3b873e;
      font-size: 1.125rem;
    }

    .tools-summary {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .tool-category {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
    }

    .tool-label {
      font-weight: 600;
      color: #1c2a39;
    }

    .tool-count {
      color: #4f5a68;
    }

    .generation-section {
      background: linear-gradient(135deg, rgba(59, 135, 62, 0.05) 0%, rgba(59, 135, 62, 0.02) 100%);
      border: 1px solid rgba(59, 135, 62, 0.1);
      border-radius: 16px;
      padding: 2rem;
    }

    .generation-card {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .generation-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .generation-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid rgba(28, 42, 57, 0.06);
    }

    .generation-item .material-symbols-outlined {
      color: #3b873e;
      font-size: 1.5rem;
      margin-top: 0.125rem;
    }

    .generation-item h4 {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1c2a39;
      margin: 0 0 0.25rem 0;
    }

    .generation-item p {
      font-size: 0.75rem;
      color: #4f5a68;
      margin: 0;
      line-height: 1.4;
    }

    .generate-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #3b873e 0%, #2f6b32 100%);
      color: #ffffff;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(59, 135, 62, 0.3);
    }

    .generate-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(59, 135, 62, 0.4);
    }

    .generate-button .material-symbols-outlined {
      font-size: 1.25rem;
    }

    @media (max-width: 768px) {
      .config-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .config-label {
        min-width: unset;
      }

      .tech-stack-grid,
      .generation-options {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StepReviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  config: BlueprintConfiguration | null = null;

  constructor(private stepperService: BlueprintStepperService) {}

  ngOnInit(): void {
    this.stepperService.configuration$
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        this.config = config;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formatProjectType(type: string): string {
    const types: { [key: string]: string } = {
      'frontend': 'Frontend App',
      'backend': 'Backend API',
      'mobile': 'Mobile App',
      'desktop': 'Desktop App'
    };
    return types[type] || type;
  }


  hasTechnologyStack(): boolean {
    if (!this.config) return false;
    const { technologyStack } = this.config;
    return !!(
      technologyStack.frontend.framework ||
      technologyStack.backend.framework
    );
  }

  hasFeatures(): boolean {
    if (!this.config) return false;
    const { features } = this.config;
    return !!(
      features.authentication.enabled ||
      features.database.enabled
    );
  }

  hasDevTools(): boolean {
    if (!this.config) return false;
    const { devTools } = this.config;
    return !!(
      devTools.testing.enabled ||
      devTools.codeQuality.enabled ||
      devTools.documentation.enabled
    );
  }

  hasDeployment(): boolean {
    if (!this.config) return false;
    const { deployment } = this.config;
    return !!(
      deployment.containerization.enabled ||
      deployment.cicd.enabled ||
      deployment.cloudProvider.enabled
    );
  }

  generateBlueprint(): void {
    console.log('Generating blueprint with configuration:', this.config);

    const configSummary = {
      project: this.config?.project?.title,
      architecture: {
        types: this.config?.architecture.projectTypes
      },
      technologies: this.config?.technologyStack,
      features: this.config?.features,
      devTools: this.config?.devTools,
      deployment: this.config?.deployment
    };

    alert(`🎉 Blueprint Generated Successfully!\n\nProject: ${this.config?.project?.title}\n\nYour customized blueprint has been generated with all your selected configurations. Check the console for detailed configuration data.`);
  }
}