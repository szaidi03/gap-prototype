import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BlueprintStepperService, DeploymentConfig } from '../../../services/blueprint-stepper.service';

@Component({
  selector: 'app-step-deployment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step-deployment">
      <div class="step-header">
        <h2 class="step-title">Deployment & DevOps</h2>
        <p class="step-description">Configure deployment strategies, containerization, and DevOps tools.</p>
      </div>

      <div class="deployment-grid">
        <div class="deployment-category">
          <h3>Containerization</h3>
          <label class="deployment-toggle">
            <input type="checkbox" [(ngModel)]="config.containerization.enabled" (change)="updateConfiguration()">
            <span>Enable Containerization</span>
          </label>
          <div class="deployment-options" *ngIf="config.containerization.enabled">
            <label *ngFor="let tool of containerTools" class="option-item">
              <input type="checkbox"
                     [checked]="config.containerization.tools.includes(tool.id)"
                     (change)="toggleContainerTool(tool.id, $any($event.target).checked)">
              <span>{{ tool.label }}</span>
            </label>
          </div>
        </div>

        <div class="deployment-category">
          <h3>CI/CD Pipeline</h3>
          <label class="deployment-toggle">
            <input type="checkbox" [(ngModel)]="config.cicd.enabled" (change)="updateConfiguration()">
            <span>Enable CI/CD</span>
          </label>
          <div class="deployment-options" *ngIf="config.cicd.enabled">
            <select [(ngModel)]="config.cicd.platform" (change)="updateConfiguration()" class="deployment-select">
              <option value="">Select CI/CD Platform</option>
              <option value="github-actions">GitHub Actions</option>
              <option value="gitlab-ci">GitLab CI</option>
              <option value="jenkins">Jenkins</option>
              <option value="circleci">CircleCI</option>
            </select>
          </div>
        </div>

        <div class="deployment-category">
          <h3>Cloud Provider</h3>
          <label class="deployment-toggle">
            <input type="checkbox" [(ngModel)]="config.cloudProvider.enabled" (change)="updateConfiguration()">
            <span>Enable Cloud Deployment</span>
          </label>
          <div class="deployment-options" *ngIf="config.cloudProvider.enabled">
            <select [(ngModel)]="config.cloudProvider.provider" (change)="updateConfiguration()" class="deployment-select">
              <option value="">Select Cloud Provider</option>
              <option value="aws">Amazon Web Services</option>
              <option value="azure">Microsoft Azure</option>
              <option value="gcp">Google Cloud Platform</option>
              <option value="vercel">Vercel</option>
              <option value="netlify">Netlify</option>
            </select>
          </div>
        </div>

        <div class="deployment-category">
          <h3>Monitoring</h3>
          <label class="deployment-toggle">
            <input type="checkbox" [(ngModel)]="config.monitoring.enabled" (change)="updateConfiguration()">
            <span>Enable Monitoring</span>
          </label>
          <div class="deployment-options" *ngIf="config.monitoring.enabled">
            <label *ngFor="let tool of monitoringTools" class="option-item">
              <input type="checkbox"
                     [checked]="config.monitoring.tools.includes(tool.id)"
                     (change)="toggleMonitoringTool(tool.id, $any($event.target).checked)">
              <span>{{ tool.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .step-deployment {
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

    .deployment-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .deployment-category {
      background: #ffffff;
      border: 1px solid rgba(28, 42, 57, 0.08);
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .deployment-category h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1c2a39;
      margin: 0;
    }

    .deployment-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      cursor: pointer;
    }

    .deployment-toggle input {
      accent-color: #3b873e;
    }

    .deployment-options {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-left: 1rem;
    }

    .option-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .option-item input {
      accent-color: #3b873e;
    }

    .deployment-select {
      padding: 0.5rem;
      border: 1px solid rgba(28, 42, 57, 0.2);
      border-radius: 6px;
      font-size: 0.875rem;
    }

    .deployment-select:focus {
      outline: none;
      border-color: #3b873e;
    }
  `]
})
export class StepDeploymentComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  config: DeploymentConfig = {
    containerization: { enabled: false, tools: [] },
    cicd: { enabled: false, features: [] },
    cloudProvider: { enabled: false, services: [] },
    monitoring: { enabled: false, tools: [] }
  };

  readonly containerTools = [
    { id: 'docker', label: 'Docker' },
    { id: 'kubernetes', label: 'Kubernetes' },
    { id: 'docker-compose', label: 'Docker Compose' }
  ];

  readonly monitoringTools = [
    { id: 'prometheus', label: 'Prometheus' },
    { id: 'grafana', label: 'Grafana' },
    { id: 'datadog', label: 'Datadog' },
    { id: 'newrelic', label: 'New Relic' }
  ];

  constructor(private stepperService: BlueprintStepperService) {}

  ngOnInit(): void {
    this.stepperService.configuration$
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        this.config = { ...config.deployment };
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleContainerTool(toolId: string, checked: boolean): void {
    if (checked) {
      if (!this.config.containerization.tools.includes(toolId)) {
        this.config.containerization.tools.push(toolId);
      }
    } else {
      this.config.containerization.tools = this.config.containerization.tools.filter(t => t !== toolId);
    }
    this.updateConfiguration();
  }

  toggleMonitoringTool(toolId: string, checked: boolean): void {
    if (checked) {
      if (!this.config.monitoring.tools.includes(toolId)) {
        this.config.monitoring.tools.push(toolId);
      }
    } else {
      this.config.monitoring.tools = this.config.monitoring.tools.filter(t => t !== toolId);
    }
    this.updateConfiguration();
  }

  updateConfiguration(): void {
    this.stepperService.updateDeployment(this.config);
  }
}