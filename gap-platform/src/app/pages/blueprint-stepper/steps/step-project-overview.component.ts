import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BlueprintStepperService, ProjectCard, AppMetadata } from '../../../services/blueprint-stepper.service';

@Component({
  selector: 'app-step-project-overview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step-overview" *ngIf="project">
      <!-- <div class="step-header">
        <h2 class="step-title">Project Overview</h2>
        <p class="step-description">
          Enter essential information about your project.
        </p>
      </div> -->

      <div class="w-full flex">
        <!-- <div class="project-showcase__left">
          <div class="project-icon" [attr.data-icon]="project.icon" [ngClass]="project.accentClass"></div>
          <div class="project-basic-info">
            <h3 class="project-name">{{ project.title }}</h3>
            <p class="project-description">{{ project.description }}</p>
            <button type="button" class="btn btn--secondary" (click)="changeProject()">
              <span class="material-symbols-outlined" aria-hidden="true">swap_horiz</span>
              <span>Change Project</span>
            </button>
          </div>
        </div> -->

         <div class="project-showcase__right">
           <form class="metadata-form">
             <div class="form-section">
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
                   <div class="field-error" *ngIf="hasError('projectName')">
                     Project name is required
                   </div>
                 </div>

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
                 </div>
               </div>
             </div>
           </form>
         </div>
      </div>
    </div>
  `,
  styles: [`
    .step-overview {
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
      margin: 0 0 0.75rem 0;
    }

    .step-description {
      font-size: 1.125rem;
      color: #4f5a68;
      line-height: 1.6;
      margin: 0;
    }

    /* Multi-column Grid Layout */
    .project-showcase {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 2rem;
      padding: 2rem;
      background: #ffffff;
      border: 1px solid rgba(28, 42, 57, 0.08);
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(28, 42, 57, 0.06);
    }

    // .project-showcase__left {
    //   display: flex;
    //   flex-direction: column;
    //   gap: 1.25rem;
    //   align-items: center;
    //   text-align: center;
    //   border-right: 1px solid rgba(28, 42, 57, 0.08);
    //   padding-right: 2rem;
    // }

    .project-icon {
      width: 80px;
      height: 80px;
      border-radius: 20px;
      display: grid;
      place-items: center;
      position: relative;
      flex-shrink: 0;
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

    .project-basic-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .project-name {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1c2a39;
      margin: 0;
    }

    .project-description {
      font-size: 0.875rem;
      color: #4f5a68;
      line-height: 1.5;
      margin: 0;
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
    }

    .btn--secondary {
      background: rgba(28, 42, 57, 0.08);
      color: #4f5a68;
    }

    .btn--secondary:hover {
      background: rgba(28, 42, 57, 0.12);
    }

    /* Form Styling */
    .project-showcase__right {
      display: flex;
      flex-direction: column;
      min-width: 100%;
    }

    .metadata-form {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .form-section {
      background: #ffffff;
      border: 1px solid rgba(28, 42, 57, 0.08);
      border-radius: 12px;
      padding: 0.5rem 1.75rem;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1c2a39;
      margin: 0 0 1.25rem 0;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid rgba(59, 135, 62, 0.1);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
      row-gap: 1rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
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
      padding: 0.625rem 0.875rem;
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

    .field-error {
      font-size: 0.75rem;
      color: #e74c3c;
      font-weight: 500;
      margin-top: 0.125rem;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .project-showcase {
        grid-template-columns: 280px 1fr;
        gap: 1.5rem;
      }

      .project-showcase__left {
        padding-right: 1.5rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .project-showcase {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .project-showcase__left {
        border-right: none;
        border-bottom: 1px solid rgba(28, 42, 57, 0.08);
        padding-right: 0;
        padding-bottom: 1.5rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StepProjectOverviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  project: ProjectCard | null = null;

  metadata: AppMetadata = {
    projectName: '',
    description: '',
    domain: '',
    organization: '',
    businessOwner: '',
    productOwner: ''
  };

  validationErrors: string[] = [];

  constructor(
    private stepperService: BlueprintStepperService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.stepperService.configuration$
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        this.project = config.project;
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
    const validation = this.stepperService.validateStep(1);
    this.validationErrors = validation.errors;
  }

  hasError(fieldName: string): boolean {
    return this.validationErrors.some(error => error.toLowerCase().includes(fieldName.toLowerCase()));
  }

  changeProject(): void {
    this.router.navigate(['/project-selection']);
  }
}
