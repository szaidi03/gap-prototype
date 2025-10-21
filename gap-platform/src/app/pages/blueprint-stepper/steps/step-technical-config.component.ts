import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import {
  BlueprintStepperService,
  ArchitectureConfig,
  TechnologyStackConfig,
  FeaturesConfig,
  DevToolsConfig
} from '../../../services/blueprint-stepper.service';

interface ProjectType {
  id: string;
  label: string;
  description: string;
  icon: string;
  frameworks?: string[];
}

@Component({
  selector: 'app-step-technical-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step-technical-config">
      <!-- <div class="step-header">
        <h2 class="step-title">Technical Configuration</h2>
        <p class="step-description">
          Configure your application architecture, technology stack, features, and development tools.
        </p>
      </div> -->

      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button
          *ngFor="let tab of tabs"
          class="tab-button"
          [class.active]="activeTab === tab.id"
          (click)="setActiveTab(tab.id)"
          type="button"
        >
          <span class="material-symbols-outlined" aria-hidden="true">{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <div class="config-sections">
        <!-- Tab 1: Architecture -->
        <section class="config-section" *ngIf="activeTab === 'architecture'">
          <div class="section-header">
            <span class="material-symbols-outlined section-icon">architecture</span>
            <div>
              <h3 class="section-title">
                Application Type
                <span class="required-indicator">*</span>
              </h3>
              <p class="section-description">
                Select the types of web applications you want to generate.
              </p>
            </div>
          </div>

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

        <!-- Tab 2: Technology Stack -->
        <section class="config-section" *ngIf="activeTab === 'stack' && architectureConfig.projectTypes.length > 0">
          <div class="section-header">
            <span class="material-symbols-outlined section-icon">stacks</span>
            <div>
              <h3 class="section-title">
                Technology Stack
                <span class="required-indicator">*</span>
              </h3>
              <p class="section-description">
                Choose the specific frameworks and technologies for your application.
              </p>
            </div>
          </div>

          <div class="technology-sections">
            <!-- Frontend Technologies -->
            <div class="tech-subsection" *ngIf="architectureConfig.projectTypes.includes('frontend')">
              <h4 class="subsection-title">Frontend Technologies</h4>
              <div class="tech-grid">
                <div class="tech-category">
                  <label class="tech-label">Framework *</label>
                  <select [(ngModel)]="techStackConfig.frontend.framework" (change)="updateConfiguration()" class="tech-select">
                    <option value="">Select Framework</option>
                    <option value="react">React</option>
                    <option value="angular">Angular</option>
                    <option value="vue">Vue.js</option>
                    <option value="svelte">Svelte</option>
                    <option value="next">Next.js</option>
                  </select>
                </div>
                <div class="tech-category">
                  <label class="tech-label">UI Library</label>
                  <select [(ngModel)]="techStackConfig.frontend.uiLibrary" (change)="updateConfiguration()" class="tech-select">
                    <option value="">Select UI Library</option>
                    <option value="material-ui">Material-UI</option>
                    <option value="ant-design">Ant Design</option>
                    <option value="chakra-ui">Chakra UI</option>
                    <option value="tailwind">Tailwind CSS</option>
                    <option value="bootstrap">Bootstrap</option>
                  </select>
                </div>
                <div class="tech-category">
                  <label class="tech-label">State Management</label>
                  <select [(ngModel)]="techStackConfig.frontend.stateManagement" (change)="updateConfiguration()" class="tech-select">
                    <option value="">Select State Management</option>
                    <option value="redux">Redux</option>
                    <option value="zustand">Zustand</option>
                    <option value="recoil">Recoil</option>
                    <option value="mobx">MobX</option>
                    <option value="context">Context API</option>
                  </select>
                </div>
                <div class="tech-category">
                  <label class="tech-label">Styling Approach</label>
                  <select [(ngModel)]="techStackConfig.frontend.styling" (change)="updateConfiguration()" class="tech-select">
                    <option value="">Select Styling</option>
                    <option value="css-modules">CSS Modules</option>
                    <option value="styled-components">Styled Components</option>
                    <option value="emotion">Emotion</option>
                    <option value="sass">Sass/SCSS</option>
                    <option value="css-in-js">CSS-in-JS</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Backend Technologies -->
            <div class="tech-subsection" *ngIf="architectureConfig.projectTypes.includes('backend')">
              <h4 class="subsection-title">Backend Technologies</h4>
              <div class="tech-grid">
                <div class="tech-category">
                  <label class="tech-label">Language *</label>
                  <select [(ngModel)]="techStackConfig.backend.language" (change)="updateConfiguration()" class="tech-select">
                    <option value="">Select Language</option>
                    <option value="javascript">JavaScript/Node.js</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                    <option value="go">Go</option>
                  </select>
                </div>
                <div class="tech-category">
                  <label class="tech-label">Framework *</label>
                  <select [(ngModel)]="techStackConfig.backend.framework" (change)="updateConfiguration()" class="tech-select">
                    <option value="">Select Framework</option>
                    <option value="express">Express.js</option>
                    <option value="fastify">Fastify</option>
                    <option value="django">Django</option>
                    <option value="flask">Flask</option>
                    <option value="spring-boot">Spring Boot</option>
                    <option value="dotnet">ASP.NET Core</option>
                  </select>
                </div>
                <div class="tech-category">
                  <label class="tech-label">Database</label>
                  <select [(ngModel)]="techStackConfig.backend.database" (change)="updateConfiguration()" class="tech-select">
                    <option value="">Select Database</option>
                    <option value="postgresql">PostgreSQL</option>
                    <option value="mysql">MySQL</option>
                    <option value="mongodb">MongoDB</option>
                    <option value="redis">Redis</option>
                    <option value="sqlite">SQLite</option>
                  </select>
                </div>
                <div class="tech-category">
                  <label class="tech-label">API Style</label>
                  <select [(ngModel)]="techStackConfig.backend.apiStyle" (change)="updateConfiguration()" class="tech-select">
                    <option value="">Select API Style</option>
                    <option value="rest">REST</option>
                    <option value="graphql">GraphQL</option>
                    <option value="grpc">gRPC</option>
                    <option value="websocket">WebSocket</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Empty state for stack tab -->
        <section class="config-section" *ngIf="activeTab === 'stack' && architectureConfig.projectTypes.length === 0">
          <div class="empty-state">
            <span class="material-symbols-outlined">info</span>
            <p>Please select at least one application type in the Architecture tab first.</p>
          </div>
        </section>

        <!-- Tab 3: Features & Integrations -->
        <section class="config-section" *ngIf="activeTab === 'features'">
          <div class="section-header">
            <span class="material-symbols-outlined section-icon">extension</span>
            <div>
              <h3 class="section-title">Features & Integrations</h3>
              <p class="section-description">
                Configure additional features and third-party integrations (optional).
              </p>
            </div>
          </div>

          <div class="features-grid">
            <!-- Authentication -->
            <div class="feature-card">
              <div class="feature-header">
                <span class="material-symbols-outlined">security</span>
                <h4>Authentication & Authorization</h4>
              </div>
              <label class="feature-toggle">
                <input type="checkbox" [(ngModel)]="featuresConfig.authentication.enabled" (change)="updateConfiguration()">
                <span>Enable Authentication</span>
              </label>
              <div class="feature-options" *ngIf="featuresConfig.authentication.enabled">
                <label *ngFor="let method of authMethods" class="option-item">
                  <input type="checkbox"
                         [checked]="featuresConfig.authentication.methods.includes(method.id)"
                         (change)="toggleAuthMethod(method.id, $any($event.target).checked)">
                  <span>{{ method.label }}</span>
                </label>
              </div>
            </div>

            <!-- Database -->
            <div class="feature-card">
              <div class="feature-header">
                <span class="material-symbols-outlined">database</span>
                <h4>Database Features</h4>
              </div>
              <label class="feature-toggle">
                <input type="checkbox" [(ngModel)]="featuresConfig.database.enabled" (change)="updateConfiguration()">
                <span>Enable Database Integration</span>
              </label>
              <div class="feature-options" *ngIf="featuresConfig.database.enabled">
                <select [(ngModel)]="featuresConfig.database.type" (change)="updateConfiguration()" class="feature-select">
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
                <h4>Real-time Features</h4>
              </div>
              <div class="feature-options">
                <label *ngFor="let feature of realTimeFeatures" class="option-item">
                  <input type="checkbox"
                         [checked]="featuresConfig.integrations.realTime.includes(feature.id)"
                         (change)="toggleRealTimeFeature(feature.id, $any($event.target).checked)">
                  <span>{{ feature.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        <!-- Tab 4: Development Tools -->
        <section class="config-section" *ngIf="activeTab === 'devtools'">
          <div class="section-header">
            <span class="material-symbols-outlined section-icon">build</span>
            <div>
              <h3 class="section-title">Development Tools</h3>
              <p class="section-description">
                Configure development tools, testing frameworks, and code quality tools (optional).
              </p>
            </div>
          </div>

          <div class="devtools-grid">
            <!-- Testing Framework -->
            <div class="tool-category">
              <div class="feature-header">
                <span class="material-symbols-outlined">science</span>
                <h4>Testing Framework</h4>
              </div>
              <label class="feature-toggle">
                <input type="checkbox" [(ngModel)]="devToolsConfig.testing.enabled" (change)="updateConfiguration()">
                <span>Enable Testing</span>
              </label>
              <div class="feature-options" *ngIf="devToolsConfig.testing.enabled">
                <label *ngFor="let framework of testingFrameworks" class="option-item">
                  <input type="checkbox"
                         [checked]="devToolsConfig.testing.frameworks.includes(framework.id)"
                         (change)="toggleTestingFramework(framework.id, $any($event.target).checked)">
                  <span>{{ framework.label }}</span>
                </label>
              </div>
            </div>

            <!-- Code Quality -->
            <div class="tool-category">
              <div class="feature-header">
                <span class="material-symbols-outlined">verified</span>
                <h4>Code Quality</h4>
              </div>
              <label class="feature-toggle">
                <input type="checkbox" [(ngModel)]="devToolsConfig.codeQuality.enabled" (change)="updateConfiguration()">
                <span>Enable Code Quality Tools</span>
              </label>
              <div class="feature-options" *ngIf="devToolsConfig.codeQuality.enabled">
                <label *ngFor="let tool of codeQualityTools" class="option-item">
                  <input type="checkbox"
                         [checked]="devToolsConfig.codeQuality.tools.includes(tool.id)"
                         (change)="toggleCodeQualityTool(tool.id, $any($event.target).checked)">
                  <span>{{ tool.label }}</span>
                </label>
              </div>
            </div>

            <!-- Documentation -->
            <div class="tool-category">
              <div class="feature-header">
                <span class="material-symbols-outlined">description</span>
                <h4>Documentation</h4>
              </div>
              <label class="feature-toggle">
                <input type="checkbox" [(ngModel)]="devToolsConfig.documentation.enabled" (change)="updateConfiguration()">
                <span>Enable Documentation Generation</span>
              </label>
              <div class="feature-options" *ngIf="devToolsConfig.documentation.enabled">
                <label *ngFor="let tool of documentationTools" class="option-item">
                  <input type="checkbox"
                         [checked]="devToolsConfig.documentation.tools.includes(tool.id)"
                         (change)="toggleDocumentationTool(tool.id, $any($event.target).checked)">
                  <span>{{ tool.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .step-technical-config {
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

    /* Tab Navigation */
    .tab-navigation {
      display: flex;
      gap: 0.5rem;
      padding: 0.5rem;
      background: #ffffff;
      border: 1px solid rgba(28, 42, 57, 0.08);
      border-radius: 12px;
      overflow-x: auto;
    }

    .tab-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: #4f5a68;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .tab-button .material-symbols-outlined {
      font-size: 1.25rem;
    }

    .tab-button:hover {
      background: rgba(59, 135, 62, 0.08);
      color: #3b873e;
    }

    .tab-button.active {
      background: #3b873e;
      color: #ffffff;
    }

    .config-sections {
      display: flex;
      flex-direction: column;
      // min-height: 400px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 3rem;
      text-align: center;
      color: #4f5a68;
    }

    .empty-state .material-symbols-outlined {
      font-size: 3rem;
      color: #3b873e;
      opacity: 0.5;
    }

    .empty-state p {
      margin: 0;
      font-size: 1rem;
    }

    .config-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 0.5rem 1.25rem;
      background: #ffffff;
      border: 1px solid rgba(28, 42, 57, 0.08);
      border-radius: 16px;
    }

    .section-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid rgba(59, 135, 62, 0.1);
    }

    .section-icon {
      font-size: 2rem;
      color: #3b873e;
      flex-shrink: 0;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1c2a39;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .required-indicator {
      color: #e74c3c;
      font-weight: 500;
    }

    .section-description {
      font-size: 0.875rem;
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
      padding: 1rem;
      border: 2px solid rgba(28, 42, 57, 0.08);
      border-radius: 12px;
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

    .technology-sections {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .tech-subsection {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      background: rgba(59, 135, 62, 0.04);
      border: 1px solid rgba(59, 135, 62, 0.12);
      border-radius: 12px;
    }

    .subsection-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1c2a39;
      margin: 0 0 0.75rem 0;
    }

    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }

    .tech-category {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .tech-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1c2a39;
    }

    .tech-select {
      padding: 0.75rem 1rem;
      border: 2px solid rgba(28, 42, 57, 0.08);
      border-radius: 8px;
      font-size: 0.875rem;
      background: #ffffff;
      color: #1c2a39;
      transition: border-color 0.2s ease;
    }

    .tech-select:focus {
      outline: none;
      border-color: #3b873e;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }

    .feature-card {
      background: rgba(59, 135, 62, 0.04);
      border: 1px solid rgba(59, 135, 62, 0.12);
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }

    .feature-header {
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }

    .feature-header .material-symbols-outlined {
      font-size: 1.25rem;
      color: #3b873e;
    }

    .feature-header h4 {
      font-size: 1rem;
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
      font-size: 0.875rem;
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
      font-size: 0.8125rem;
    }

    .option-item input {
      accent-color: #3b873e;
    }

    .feature-select {
      padding: 0.5rem;
      border: 1px solid rgba(28, 42, 57, 0.2);
      border-radius: 6px;
      font-size: 0.875rem;
      background: #ffffff;
    }

    .feature-select:focus {
      outline: none;
      border-color: #3b873e;
    }

    /* Development Tools Grid */
    .devtools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }

    .tool-category {
      background: rgba(59, 135, 62, 0.04);
      border: 1px solid rgba(59, 135, 62, 0.12);
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }

    @media (max-width: 768px) {
      .project-types-grid,
      .tech-grid,
      .features-grid,
      .devtools-grid {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
      }

      .tab-navigation {
        overflow-x: auto;
      }
    }
  `]
})
export class StepTechnicalConfigComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  activeTab = 'architecture';

  architectureConfig: ArchitectureConfig = {
    projectTypes: [],
    frameworks: {}
  };

  techStackConfig: TechnologyStackConfig = {
    frontend: {},
    backend: {}
  };

  featuresConfig: FeaturesConfig = {
    authentication: { enabled: false, methods: [] },
    database: { enabled: false, features: [] },
    integrations: { thirdParty: [], realTime: [] }
  };

  devToolsConfig: DevToolsConfig = {
    testing: { enabled: false, frameworks: [], types: [] },
    codeQuality: { enabled: false, tools: [] },
    documentation: { enabled: false, tools: [] }
  };

  showProjectTypeError = false;

  readonly tabs = [
    { id: 'architecture', label: 'Architecture', icon: 'architecture' },
    { id: 'stack', label: 'Technology Stack', icon: 'stacks' },
    { id: 'features', label: 'Features', icon: 'extension' },
    { id: 'devtools', label: 'Dev Tools', icon: 'build' }
  ];

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
        this.architectureConfig = { ...config.architecture };
        this.techStackConfig = { ...config.technologyStack };
        this.featuresConfig = { ...config.features };
        this.devToolsConfig = { ...config.devTools };
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  isProjectTypeSelected(projectType: string): boolean {
    return this.architectureConfig.projectTypes.includes(projectType);
  }

  onProjectTypeChange(projectType: string, checked: boolean): void {
    if (checked) {
      if (!this.architectureConfig.projectTypes.includes(projectType)) {
        this.architectureConfig.projectTypes.push(projectType);
      }
    } else {
      this.architectureConfig.projectTypes = this.architectureConfig.projectTypes.filter(type => type !== projectType);
    }

    this.showProjectTypeError = false;
    this.updateConfiguration();
  }

  getSelectedProjectTypes(): ProjectType[] {
    return this.projectTypes.filter(type => this.architectureConfig.projectTypes.includes(type.id));
  }

  toggleAuthMethod(methodId: string, checked: boolean): void {
    if (checked) {
      if (!this.featuresConfig.authentication.methods.includes(methodId)) {
        this.featuresConfig.authentication.methods.push(methodId);
      }
    } else {
      this.featuresConfig.authentication.methods = this.featuresConfig.authentication.methods.filter(m => m !== methodId);
    }
    this.updateConfiguration();
  }

  toggleRealTimeFeature(featureId: string, checked: boolean): void {
    if (checked) {
      if (!this.featuresConfig.integrations.realTime.includes(featureId)) {
        this.featuresConfig.integrations.realTime.push(featureId);
      }
    } else {
      this.featuresConfig.integrations.realTime = this.featuresConfig.integrations.realTime.filter(f => f !== featureId);
    }
    this.updateConfiguration();
  }

  hasConfiguration(): boolean {
    return this.architectureConfig.projectTypes.length > 0;
  }

  getFrameworkDisplayName(category: string, value: string): string {
    const displayNames: { [key: string]: { [key: string]: string } } = {
      frontend: {
        'react': 'React',
        'angular': 'Angular',
        'vue': 'Vue.js',
        'svelte': 'Svelte',
        'next': 'Next.js'
      },
      'ui-library': {
        'material-ui': 'Material-UI',
        'ant-design': 'Ant Design',
        'chakra-ui': 'Chakra UI',
        'tailwind': 'Tailwind CSS',
        'bootstrap': 'Bootstrap'
      },
      state: {
        'redux': 'Redux',
        'zustand': 'Zustand',
        'recoil': 'Recoil',
        'mobx': 'MobX',
        'context': 'Context API'
      },
      backend: {
        'express': 'Express.js',
        'fastify': 'Fastify',
        'django': 'Django',
        'flask': 'Flask',
        'spring-boot': 'Spring Boot',
        'dotnet': 'ASP.NET Core'
      },
      database: {
        'postgresql': 'PostgreSQL',
        'mysql': 'MySQL',
        'mongodb': 'MongoDB',
        'redis': 'Redis',
        'sqlite': 'SQLite'
      },
      api: {
        'rest': 'REST API',
        'graphql': 'GraphQL',
        'grpc': 'gRPC',
        'websocket': 'WebSocket'
      },
    };

    return displayNames[category]?.[value] || value;
  }

  updateConfiguration(): void {
    this.stepperService.updateArchitecture(this.architectureConfig);
    this.stepperService.updateTechnologyStack(this.techStackConfig);
    this.stepperService.updateFeatures(this.featuresConfig);
    this.stepperService.updateDevTools(this.devToolsConfig);

    // Validate current step
    const validation = this.stepperService.validateStep(2);
    this.showProjectTypeError = validation.errors.includes('Please select at least one application type');
  }

  toggleTestingFramework(frameworkId: string, checked: boolean): void {
    if (checked) {
      if (!this.devToolsConfig.testing.frameworks.includes(frameworkId)) {
        this.devToolsConfig.testing.frameworks.push(frameworkId);
      }
    } else {
      this.devToolsConfig.testing.frameworks = this.devToolsConfig.testing.frameworks.filter(f => f !== frameworkId);
    }
    this.updateConfiguration();
  }

  toggleCodeQualityTool(toolId: string, checked: boolean): void {
    if (checked) {
      if (!this.devToolsConfig.codeQuality.tools.includes(toolId)) {
        this.devToolsConfig.codeQuality.tools.push(toolId);
      }
    } else {
      this.devToolsConfig.codeQuality.tools = this.devToolsConfig.codeQuality.tools.filter(t => t !== toolId);
    }
    this.updateConfiguration();
  }

  toggleDocumentationTool(toolId: string, checked: boolean): void {
    if (checked) {
      if (!this.devToolsConfig.documentation.tools.includes(toolId)) {
        this.devToolsConfig.documentation.tools.push(toolId);
      }
    } else {
      this.devToolsConfig.documentation.tools = this.devToolsConfig.documentation.tools.filter(t => t !== toolId);
    }
    this.updateConfiguration();
  }
}
