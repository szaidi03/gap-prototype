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
        <!-- Project Overview -->
        <div class="review-section">
          <h3 class="section-title">Project Overview</h3>
          <div class="review-card project-overview-card">
            <div class="project-metadata">
              <div class="metadata-grid">
                <div class="metadata-item" *ngIf="config.metadata.projectName">
                  <span class="metadata-label">Project Name:</span>
                  <span class="metadata-value">{{ config.metadata.projectName }}</span>
                </div>
                <div class="metadata-item" *ngIf="config.metadata.organization">
                  <span class="metadata-label">Organization:</span>
                  <span class="metadata-value">{{ config.metadata.organization }}</span>
                </div>
                <div class="metadata-item" *ngIf="config.metadata.domain">
                  <span class="metadata-label">Domain:</span>
                  <span class="metadata-value">{{ config.metadata.domain }}</span>
                </div>
                <div class="metadata-item" *ngIf="config.metadata.businessOwner">
                  <span class="metadata-label">Business Owner:</span>
                  <span class="metadata-value">{{ config.metadata.businessOwner }}</span>
                </div>
                <div class="metadata-item" *ngIf="config.metadata.productOwner">
                  <span class="metadata-label">Product Owner:</span>
                  <span class="metadata-value">{{ config.metadata.productOwner }}</span>
                </div>
              </div>
              <div class="metadata-description" *ngIf="config.metadata.description">
                <span class="metadata-label">Description:</span>
                <p class="metadata-value">{{ config.metadata.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Consolidated Configuration Card with Tabs -->
        <div class="review-section">
          <h3 class="section-title">Configuration</h3>
          <div class="review-card consolidated-config-card">
            <div class="config-tabs">
              <button 
                class="config-tab" 
                [class.active]="activeConfigTab === 'types'"
                (click)="activeConfigTab = 'types'"
              >
                <span class="material-symbols-outlined">apps</span>
                <span>Application Types</span>
              </button>
              <button 
                class="config-tab" 
                [class.active]="activeConfigTab === 'stack'"
                (click)="activeConfigTab = 'stack'"
              >
                <span class="material-symbols-outlined">code</span>
                <span>Technology Stack</span>
              </button>
              <button 
                class="config-tab" 
                [class.active]="activeConfigTab === 'features'"
                (click)="activeConfigTab = 'features'"
              >
                <span class="material-symbols-outlined">extension</span>
                <span>Features</span>
              </button>
            </div>

            <div class="config-content">
              <!-- Application Types Tab -->
              <div class="tab-panel" *ngIf="activeConfigTab === 'types'">
                <div class="config-row">
                  <span class="config-label">Application Types:</span>
                  <div class="config-tags">
                    <span class="config-tag" *ngFor="let type of config.architecture.projectTypes">{{ formatProjectType(type) }}</span>
                  </div>
                </div>
              </div>

              <!-- Technology Stack Tab -->
              <div class="tab-panel" *ngIf="activeConfigTab === 'stack'">
                <div class="tech-stack-grid">
                  <div class="tech-stack-item" *ngIf="config.technologyStack.frontend.framework">
                    <h4>Frontend</h4>
                    <div class="tech-list">
                      <span class="tech-item">{{ config.technologyStack.frontend.framework }}</span>
                      <span class="tech-item" *ngIf="config.technologyStack.frontend.uiLibrary">{{ config.technologyStack.frontend.uiLibrary }}</span>
                      <span class="tech-item" *ngIf="config.technologyStack.frontend.stateManagement">{{ config.technologyStack.frontend.stateManagement }}</span>
                      <span class="tech-item" *ngIf="config.technologyStack.frontend.styling">{{ config.technologyStack.frontend.styling }}</span>
                    </div>
                  </div>
                  <div class="tech-stack-item" *ngIf="config.technologyStack.backend.framework">
                    <h4>Backend</h4>
                    <div class="tech-list">
                      <span class="tech-item" *ngIf="config.technologyStack.backend.language">{{ config.technologyStack.backend.language }}</span>
                      <span class="tech-item">{{ config.technologyStack.backend.framework }}</span>
                      <span class="tech-item" *ngIf="config.technologyStack.backend.database">{{ config.technologyStack.backend.database }}</span>
                      <span class="tech-item" *ngIf="config.technologyStack.backend.apiStyle">{{ config.technologyStack.backend.apiStyle }}</span>
                    </div>
                  </div>
                </div>
                <div class="empty-state" *ngIf="!hasTechnologyStack()">
                  <span class="material-symbols-outlined">info</span>
                  <p>No technology stack configured</p>
                </div>
              </div>

              <!-- Features Tab -->
              <div class="tab-panel" *ngIf="activeConfigTab === 'features'">
                <div class="feature-summary">
                  <div class="feature-item" *ngIf="config.features.authentication.enabled">
                    <span class="material-symbols-outlined">security</span>
                    <span>Authentication ({{ config.features.authentication.methods.length }} methods)</span>
                  </div>
                  <div class="feature-item" *ngIf="config.features.database.enabled">
                    <span class="material-symbols-outlined">database</span>
                    <span>Database Integration</span>
                  </div>
                  <div class="feature-item" *ngIf="config.features.integrations.realTime.length > 0">
                    <span class="material-symbols-outlined">live_tv</span>
                    <span>Real-time Features ({{ config.features.integrations.realTime.length }})</span>
                  </div>
                </div>
                <div class="empty-state" *ngIf="!hasFeatures()">
                  <span class="material-symbols-outlined">info</span>
                  <p>No features configured</p>
                </div>
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
      gap: 0.75rem;
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

    .project-overview-card {
      padding: 2rem;
    }

    .project-metadata {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .metadata-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .metadata-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .metadata-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .metadata-value {
      font-size: 0.875rem;
      color: #1c2a39;
      font-weight: 500;
    }

    .metadata-description {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .metadata-description .metadata-value {
      margin: 0;
      line-height: 1.6;
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

    .consolidated-config-card {
      padding: 0;
      overflow: hidden;
    }

    .config-tabs {
      display: flex;
      border-bottom: 2px solid rgba(28, 42, 57, 0.08);
      background: rgba(28, 42, 57, 0.02);
    }

    .config-tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1rem 1.5rem;
      background: transparent;
      border: none;
      color: #4f5a68;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }

    .config-tab:hover {
      background: rgba(59, 135, 62, 0.05);
      color: #1c2a39;
    }

    .config-tab.active {
      background: #ffffff;
      color: #3b873e;
    }

    .config-tab.active::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background: #3b873e;
    }

    .config-tab .material-symbols-outlined {
      font-size: 1.25rem;
    }

    .config-content {
      padding: 1.5rem;
    }

    .tab-panel {
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 2rem;
      color: #6b7280;
    }

    .empty-state .material-symbols-outlined {
      font-size: 2rem;
      color: #9ca3af;
    }

    .empty-state p {
      margin: 0;
      font-size: 0.875rem;
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

    @media (max-width: 1024px) {
      .metadata-grid {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .metadata-grid {
        grid-template-columns: 1fr;
      }

      .config-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .config-label {
        min-width: unset;
      }

      .config-tabs {
        flex-direction: column;
      }

      .config-tab {
        justify-content: flex-start;
        padding: 0.875rem 1.25rem;
      }

      .config-tab.active::after {
        left: 0;
        right: auto;
        width: 3px;
        height: 100%;
        bottom: 0;
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
  activeConfigTab: 'types' | 'stack' | 'features' = 'types';

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