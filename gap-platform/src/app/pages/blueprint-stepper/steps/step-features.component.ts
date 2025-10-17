import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BlueprintStepperService, FeaturesConfig } from '../../../services/blueprint-stepper.service';

@Component({
  selector: 'app-step-features',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step-features">
      <div class="step-header">
        <h2 class="step-title">Features & Integrations</h2>
        <p class="step-description">Configure additional features and third-party integrations for your application.</p>
      </div>

      <div class="features-grid">
        <!-- Authentication -->
        <div class="feature-card">
          <div class="feature-header">
            <span class="material-symbols-outlined">security</span>
            <h3>Authentication & Authorization</h3>
          </div>
          <label class="feature-toggle">
            <input type="checkbox" [(ngModel)]="config.authentication.enabled" (change)="updateConfiguration()">
            <span>Enable Authentication</span>
          </label>
          <div class="feature-options" *ngIf="config.authentication.enabled">
            <label *ngFor="let method of authMethods" class="option-item">
              <input type="checkbox"
                     [checked]="config.authentication.methods.includes(method.id)"
                     (change)="toggleAuthMethod(method.id, $any($event.target).checked)">
              <span>{{ method.label }}</span>
            </label>
          </div>
        </div>

        <!-- Database -->
        <div class="feature-card">
          <div class="feature-header">
            <span class="material-symbols-outlined">database</span>
            <h3>Database Features</h3>
          </div>
          <label class="feature-toggle">
            <input type="checkbox" [(ngModel)]="config.database.enabled" (change)="updateConfiguration()">
            <span>Enable Database Integration</span>
          </label>
          <div class="feature-options" *ngIf="config.database.enabled">
            <select [(ngModel)]="config.database.type" (change)="updateConfiguration()" class="feature-select">
              <option value="">Select Database Type</option>
              <option value="sql">SQL Database</option>
              <option value="nosql">NoSQL Database</option>
              <option value="cache">Cache Database</option>
            </select>
          </div>
        </div>

        <!-- Real-time Features -->
        <div class="feature-card">
          <div class="feature-header">
            <span class="material-symbols-outlined">live_tv</span>
            <h3>Real-time Features</h3>
          </div>
          <div class="feature-options">
            <label *ngFor="let feature of realTimeFeatures" class="option-item">
              <input type="checkbox"
                     [checked]="config.integrations.realTime.includes(feature.id)"
                     (change)="toggleRealTimeFeature(feature.id, $any($event.target).checked)">
              <span>{{ feature.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .step-features {
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

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .feature-card {
      background: #ffffff;
      border: 1px solid rgba(28, 42, 57, 0.08);
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .feature-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .feature-header .material-symbols-outlined {
      font-size: 1.5rem;
      color: #3b873e;
    }

    .feature-header h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1c2a39;
      margin: 0;
    }

    .feature-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      cursor: pointer;
    }

    .feature-toggle input {
      accent-color: #3b873e;
    }

    .feature-options {
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

    .feature-select {
      padding: 0.5rem;
      border: 1px solid rgba(28, 42, 57, 0.2);
      border-radius: 6px;
      font-size: 0.875rem;
    }

    .feature-select:focus {
      outline: none;
      border-color: #3b873e;
    }
  `]
})
export class StepFeaturesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  config: FeaturesConfig = {
    authentication: { enabled: false, methods: [] },
    database: { enabled: false, features: [] },
    integrations: { thirdParty: [], realTime: [] }
  };

  readonly authMethods = [
    { id: 'oauth', label: 'OAuth 2.0' },
    { id: 'jwt', label: 'JWT Tokens' },
    { id: 'session', label: 'Session-based' },
    { id: 'saml', label: 'SAML' }
  ];

  readonly realTimeFeatures = [
    { id: 'websocket', label: 'WebSocket Support' },
    { id: 'sse', label: 'Server-Sent Events' },
    { id: 'push', label: 'Push Notifications' }
  ];

  constructor(private stepperService: BlueprintStepperService) {}

  ngOnInit(): void {
    this.stepperService.configuration$
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        this.config = { ...config.features };
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleAuthMethod(methodId: string, checked: boolean): void {
    if (checked) {
      if (!this.config.authentication.methods.includes(methodId)) {
        this.config.authentication.methods.push(methodId);
      }
    } else {
      this.config.authentication.methods = this.config.authentication.methods.filter(m => m !== methodId);
    }
    this.updateConfiguration();
  }

  toggleRealTimeFeature(featureId: string, checked: boolean): void {
    if (checked) {
      if (!this.config.integrations.realTime.includes(featureId)) {
        this.config.integrations.realTime.push(featureId);
      }
    } else {
      this.config.integrations.realTime = this.config.integrations.realTime.filter(f => f !== featureId);
    }
    this.updateConfiguration();
  }

  updateConfiguration(): void {
    this.stepperService.updateFeatures(this.config);
  }
}