import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BlueprintStepperService, AppMetadata } from '../../../services/blueprint-stepper.service';

@Component({
  selector: 'app-step-metadata',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step-metadata">
      <div class="step-header">
        <h2 class="step-title">App Metadata</h2>
        <p class="step-description">
          Enter the essential information about your project. This metadata will be used to configure
          your blueprint and generate appropriate documentation.
        </p>
      </div>

      <form class="metadata-form">
        <div class="form-sections">
          <!-- Project Information -->
          <section class="form-section">
            <h3 class="section-title">Project Information</h3>
            <div class="form-grid">
              <div class="form-field">
                <label class="field-label">
                  Project Name <span class="required">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="metadata.projectName"
                  name="projectName"
                  (input)="updateConfiguration()"
                  class="field-input"
                  placeholder="Enter your project name"
                  [class.error]="hasError('projectName')"
                />
                <div class="field-hint">This will be used as the main project identifier</div>
                <div class="field-error" *ngIf="hasError('projectName')">
                  Project name is required
                </div>
              </div>

              <div class="form-field full-width">
                <label class="field-label">
                  Description <span class="required">*</span>
                </label>
                <textarea
                  [(ngModel)]="metadata.description"
                  name="description"
                  (input)="updateConfiguration()"
                  class="field-textarea"
                  placeholder="Describe what your application will do..."
                  rows="3"
                  [class.error]="hasError('description')"
                ></textarea>
                <div class="field-hint">Provide a clear description of your application's purpose and functionality</div>
                <div class="field-error" *ngIf="hasError('description')">
                  Project description is required
                </div>
              </div>

              <div class="form-field">
                <label class="field-label">Domain</label>
                <input
                  type="text"
                  [(ngModel)]="metadata.domain"
                  name="domain"
                  (input)="updateConfiguration()"
                  class="field-input"
                  placeholder="e.g., healthcare, finance, e-commerce"
                />
                <div class="field-hint">The business domain or industry sector</div>
              </div>
            </div>
          </section>

          <!-- Organization Details -->
          <section class="form-section">
            <h3 class="section-title">Organization Details</h3>
            <div class="form-grid">
              <div class="form-field">
                <label class="field-label">
                  Organization <span class="required">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="metadata.organization"
                  name="organization"
                  (input)="updateConfiguration()"
                  class="field-input"
                  placeholder="Your company or organization name"
                  [class.error]="hasError('organization')"
                />
                <div class="field-error" *ngIf="hasError('organization')">
                  Organization name is required
                </div>
              </div>

              <div class="form-field">
                <label class="field-label">Business Owner</label>
                <input
                  type="text"
                  [(ngModel)]="metadata.businessOwner"
                  name="businessOwner"
                  (input)="updateConfiguration()"
                  class="field-input"
                  placeholder="Name of the business stakeholder"
                />
                <div class="field-hint">The person responsible for business requirements</div>
              </div>

              <div class="form-field">
                <label class="field-label">Product Owner</label>
                <input
                  type="text"
                  [(ngModel)]="metadata.productOwner"
                  name="productOwner"
                  (input)="updateConfiguration()"
                  class="field-input"
                  placeholder="Name of the product owner"
                />
                <div class="field-hint">The person responsible for product decisions</div>
              </div>
            </div>
          </section>

          <!-- Validation Summary -->
          <section class="validation-section" *ngIf="validationErrors.length > 0">
            <h3 class="validation-title">Please complete the required fields:</h3>
            <ul class="validation-list">
              <li *ngFor="let error of validationErrors" class="validation-item">
                {{ error }}
              </li>
            </ul>
          </section>

          <!-- Configuration Preview -->
          <section class="preview-section" *ngIf="metadata.projectName && metadata.description && metadata.organization">
            <h3 class="section-title">Project Summary</h3>
            <div class="project-preview">
              <div class="preview-header">
                <h4 class="preview-title">{{ metadata.projectName }}</h4>
                <span class="preview-org">{{ metadata.organization }}</span>
              </div>
              <p class="preview-description">{{ metadata.description }}</p>
              <div class="preview-details" *ngIf="metadata.domain || metadata.businessOwner || metadata.productOwner">
                <div class="preview-detail" *ngIf="metadata.domain">
                  <span class="detail-label">Domain:</span>
                  <span class="detail-value">{{ metadata.domain }}</span>
                </div>
                <div class="preview-detail" *ngIf="metadata.businessOwner">
                  <span class="detail-label">Business Owner:</span>
                  <span class="detail-value">{{ metadata.businessOwner }}</span>
                </div>
                <div class="preview-detail" *ngIf="metadata.productOwner">
                  <span class="detail-label">Product Owner:</span>
                  <span class="detail-value">{{ metadata.productOwner }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .step-metadata {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .step-header {
      text-align: center;
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

    .metadata-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-sections {
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }

    .form-section {
      background: #ffffff;
      border: 1px solid rgba(28, 42, 57, 0.08);
      border-radius: 16px;
      padding: 2rem;
    }

    .section-title {
      font-size: 1.375rem;
      font-weight: 600;
      color: #1c2a39;
      margin: 0 0 1.5rem 0;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid rgba(59, 135, 62, 0.1);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-field.full-width {
      grid-column: 1 / -1;
    }

    .field-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1c2a39;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .required {
      color: #e74c3c;
      font-weight: 500;
    }

    .field-input,
    .field-textarea {
      padding: 0.75rem 1rem;
      border: 2px solid rgba(28, 42, 57, 0.08);
      border-radius: 8px;
      font-size: 0.875rem;
      background: #ffffff;
      color: #1c2a39;
      transition: all 0.2s ease;
      resize: vertical;
    }

    .field-input:focus,
    .field-textarea:focus {
      outline: none;
      border-color: #3b873e;
      box-shadow: 0 0 0 3px rgba(59, 135, 62, 0.1);
    }

    .field-input.error,
    .field-textarea.error {
      border-color: #e74c3c;
    }

    .field-input.error:focus,
    .field-textarea.error:focus {
      border-color: #e74c3c;
      box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }

    .field-hint {
      font-size: 0.75rem;
      color: #6b7280;
      line-height: 1.4;
    }

    .field-error {
      font-size: 0.75rem;
      color: #e74c3c;
      font-weight: 500;
    }

    .validation-section {
      background: rgba(231, 76, 60, 0.05);
      border: 1px solid rgba(231, 76, 60, 0.2);
      border-radius: 12px;
      padding: 1.5rem;
    }

    .validation-title {
      font-size: 1rem;
      font-weight: 600;
      color: #c0392b;
      margin: 0 0 1rem 0;
    }

    .validation-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .validation-item {
      font-size: 0.875rem;
      color: #c0392b;
      position: relative;
      padding-left: 1rem;
    }

    .validation-item::before {
      content: '•';
      position: absolute;
      left: 0;
      color: #e74c3c;
    }

    .preview-section {
      background: linear-gradient(135deg, rgba(59, 135, 62, 0.05) 0%, rgba(59, 135, 62, 0.02) 100%);
      border: 1px solid rgba(59, 135, 62, 0.1);
      border-radius: 16px;
      padding: 2rem;
    }

    .project-preview {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .preview-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .preview-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1c2a39;
      margin: 0;
    }

    .preview-org {
      font-size: 0.875rem;
      color: #3b873e;
      font-weight: 500;
      padding: 0.25rem 0.75rem;
      background: rgba(59, 135, 62, 0.1);
      border-radius: 12px;
    }

    .preview-description {
      font-size: 0.875rem;
      color: #4f5a68;
      line-height: 1.6;
      margin: 0;
    }

    .preview-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .preview-detail {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
    }

    .detail-label {
      font-weight: 600;
      color: #6b7280;
      min-width: 100px;
    }

    .detail-value {
      color: #4f5a68;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .preview-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class StepMetadataComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  metadata: AppMetadata = {
    projectName: '',
    description: '',
    domain: '',
    organization: '',
    businessOwner: '',
    productOwner: ''
  };

  validationErrors: string[] = [];

  constructor(private stepperService: BlueprintStepperService) {}

  ngOnInit(): void {
    this.stepperService.configuration$
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        this.metadata = { ...config.metadata };
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateConfiguration(): void {
    this.stepperService.updateMetadata(this.metadata);
    this.validateForm();
  }

  private validateForm(): void {
    const validation = this.stepperService.validateStep(2);
    this.validationErrors = validation.errors;
  }

  hasError(fieldName: string): boolean {
    return this.validationErrors.some(error => error.toLowerCase().includes(fieldName.toLowerCase()));
  }
}