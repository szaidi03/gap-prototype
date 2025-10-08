import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BlueprintStepperService, DevToolsConfig } from '../../../services/blueprint-stepper.service';

@Component({
  selector: 'app-step-dev-tools',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step-dev-tools">
      <div class="step-header">
        <h2 class="step-title">Development Tools</h2>
        <p class="step-description">Configure development tools, testing frameworks, and code quality tools.</p>
      </div>

      <div class="tools-grid">
        <div class="tool-category">
          <h3>Testing Framework</h3>
          <label class="tool-toggle">
            <input type="checkbox" [(ngModel)]="config.testing.enabled" (change)="updateConfiguration()">
            <span>Enable Testing</span>
          </label>
          <div class="tool-options" *ngIf="config.testing.enabled">
            <label *ngFor="let framework of testingFrameworks" class="option-item">
              <input type="checkbox"
                     [checked]="config.testing.frameworks.includes(framework.id)"
                     (change)="toggleTestingFramework(framework.id, $any($event.target).checked)">
              <span>{{ framework.label }}</span>
            </label>
          </div>
        </div>

        <div class="tool-category">
          <h3>Code Quality</h3>
          <label class="tool-toggle">
            <input type="checkbox" [(ngModel)]="config.codeQuality.enabled" (change)="updateConfiguration()">
            <span>Enable Code Quality Tools</span>
          </label>
          <div class="tool-options" *ngIf="config.codeQuality.enabled">
            <label *ngFor="let tool of codeQualityTools" class="option-item">
              <input type="checkbox"
                     [checked]="config.codeQuality.tools.includes(tool.id)"
                     (change)="toggleCodeQualityTool(tool.id, $any($event.target).checked)">
              <span>{{ tool.label }}</span>
            </label>
          </div>
        </div>

        <div class="tool-category">
          <h3>Documentation</h3>
          <label class="tool-toggle">
            <input type="checkbox" [(ngModel)]="config.documentation.enabled" (change)="updateConfiguration()">
            <span>Enable Documentation Generation</span>
          </label>
          <div class="tool-options" *ngIf="config.documentation.enabled">
            <label *ngFor="let tool of documentationTools" class="option-item">
              <input type="checkbox"
                     [checked]="config.documentation.tools.includes(tool.id)"
                     (change)="toggleDocumentationTool(tool.id, $any($event.target).checked)">
              <span>{{ tool.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .step-dev-tools {
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

    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .tool-category {
      background: #ffffff;
      border: 1px solid rgba(28, 42, 57, 0.08);
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .tool-category h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1c2a39;
      margin: 0;
    }

    .tool-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      cursor: pointer;
    }

    .tool-toggle input {
      accent-color: #3b873e;
    }

    .tool-options {
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
  `]
})
export class StepDevToolsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  config: DevToolsConfig = {
    testing: { enabled: false, frameworks: [], types: [] },
    codeQuality: { enabled: false, tools: [] },
    documentation: { enabled: false, tools: [] }
  };

  readonly testingFrameworks = [
    { id: 'jest', label: 'Jest' },
    { id: 'vitest', label: 'Vitest' },
    { id: 'cypress', label: 'Cypress' },
    { id: 'playwright', label: 'Playwright' }
  ];

  readonly codeQualityTools = [
    { id: 'eslint', label: 'ESLint' },
    { id: 'prettier', label: 'Prettier' },
    { id: 'sonarqube', label: 'SonarQube' },
    { id: 'husky', label: 'Husky (Git Hooks)' }
  ];

  readonly documentationTools = [
    { id: 'jsdoc', label: 'JSDoc' },
    { id: 'typedoc', label: 'TypeDoc' },
    { id: 'storybook', label: 'Storybook' },
    { id: 'swagger', label: 'Swagger/OpenAPI' }
  ];

  constructor(private stepperService: BlueprintStepperService) {}

  ngOnInit(): void {
    this.stepperService.configuration$
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        this.config = { ...config.devTools };
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleTestingFramework(frameworkId: string, checked: boolean): void {
    if (checked) {
      if (!this.config.testing.frameworks.includes(frameworkId)) {
        this.config.testing.frameworks.push(frameworkId);
      }
    } else {
      this.config.testing.frameworks = this.config.testing.frameworks.filter(f => f !== frameworkId);
    }
    this.updateConfiguration();
  }

  toggleCodeQualityTool(toolId: string, checked: boolean): void {
    if (checked) {
      if (!this.config.codeQuality.tools.includes(toolId)) {
        this.config.codeQuality.tools.push(toolId);
      }
    } else {
      this.config.codeQuality.tools = this.config.codeQuality.tools.filter(t => t !== toolId);
    }
    this.updateConfiguration();
  }

  toggleDocumentationTool(toolId: string, checked: boolean): void {
    if (checked) {
      if (!this.config.documentation.tools.includes(toolId)) {
        this.config.documentation.tools.push(toolId);
      }
    } else {
      this.config.documentation.tools = this.config.documentation.tools.filter(t => t !== toolId);
    }
    this.updateConfiguration();
  }

  updateConfiguration(): void {
    this.stepperService.updateDevTools(this.config);
  }
}