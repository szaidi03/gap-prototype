import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BlueprintStepperService, TechnologyStackConfig, ArchitectureConfig } from '../../../services/blueprint-stepper.service';

@Component({
  selector: 'app-step-technology-stack',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step-technology-stack">
      <div class="step-header">
        <h2 class="step-title">Technology Stack</h2>
        <p class="step-description">
          Choose the specific frameworks, libraries, and technologies for each application type you selected.
        </p>
      </div>

      <div class="technology-sections">
        <!-- Frontend Technologies -->
        <section class="tech-section" *ngIf="architectureConfig.projectTypes.includes('frontend')">
          <h3 class="section-title">Frontend Technologies</h3>
          <div class="tech-grid">
            <div class="tech-category">
              <label class="tech-label">Framework *</label>
              <select [(ngModel)]="config.frontend.framework" (change)="updateConfiguration()" class="tech-select">
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
              <select [(ngModel)]="config.frontend.uiLibrary" (change)="updateConfiguration()" class="tech-select">
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
              <select [(ngModel)]="config.frontend.stateManagement" (change)="updateConfiguration()" class="tech-select">
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
              <select [(ngModel)]="config.frontend.styling" (change)="updateConfiguration()" class="tech-select">
                <option value="">Select Styling</option>
                <option value="css-modules">CSS Modules</option>
                <option value="styled-components">Styled Components</option>
                <option value="emotion">Emotion</option>
                <option value="sass">Sass/SCSS</option>
                <option value="css-in-js">CSS-in-JS</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Backend Technologies -->
        <section class="tech-section" *ngIf="architectureConfig.projectTypes.includes('backend')">
          <h3 class="section-title">Backend Technologies</h3>
          <div class="tech-grid">
            <div class="tech-category">
              <label class="tech-label">Language *</label>
              <select [(ngModel)]="config.backend.language" (change)="updateConfiguration()" class="tech-select">
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
              <select [(ngModel)]="config.backend.framework" (change)="updateConfiguration()" class="tech-select">
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
              <select [(ngModel)]="config.backend.database" (change)="updateConfiguration()" class="tech-select">
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
              <select [(ngModel)]="config.backend.apiStyle" (change)="updateConfiguration()" class="tech-select">
                <option value="">Select API Style</option>
                <option value="rest">REST</option>
                <option value="graphql">GraphQL</option>
                <option value="grpc">gRPC</option>
                <option value="websocket">WebSocket</option>
              </select>
            </div>
          </div>
        </section>


        <!-- Configuration Preview -->
        <section class="config-preview" *ngIf="hasAnyConfiguration()">
          <h3 class="section-title">Technology Stack Summary</h3>
          <div class="stack-summary">
            <div class="stack-item" *ngIf="architectureConfig.projectTypes.includes('frontend') && config.frontend.framework">
              <h4>Frontend Stack</h4>
              <div class="stack-tags">
                <span class="stack-tag">{{ getFrameworkDisplayName('frontend', config.frontend.framework) }}</span>
                <span class="stack-tag" *ngIf="config.frontend.uiLibrary">{{ getFrameworkDisplayName('ui-library', config.frontend.uiLibrary) }}</span>
                <span class="stack-tag" *ngIf="config.frontend.stateManagement">{{ getFrameworkDisplayName('state', config.frontend.stateManagement) }}</span>
              </div>
            </div>
            <div class="stack-item" *ngIf="architectureConfig.projectTypes.includes('backend') && config.backend.framework">
              <h4>Backend Stack</h4>
              <div class="stack-tags">
                <span class="stack-tag">{{ getFrameworkDisplayName('backend', config.backend.framework) }}</span>
                <span class="stack-tag" *ngIf="config.backend.database">{{ getFrameworkDisplayName('database', config.backend.database) }}</span>
                <span class="stack-tag" *ngIf="config.backend.apiStyle">{{ getFrameworkDisplayName('api', config.backend.apiStyle) }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .step-technology-stack {
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

    .technology-sections {
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }

    .tech-section {
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

    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
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

    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .checkbox-item input {
      accent-color: #3b873e;
    }

    .config-preview {
      background: linear-gradient(135deg, rgba(59, 135, 62, 0.05) 0%, rgba(59, 135, 62, 0.02) 100%);
      border: 1px solid rgba(59, 135, 62, 0.1);
      border-radius: 16px;
      padding: 2rem;
    }

    .stack-summary {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .stack-item h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #1c2a39;
      margin: 0 0 0.75rem 0;
    }

    .stack-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .stack-tag {
      padding: 0.375rem 0.75rem;
      background: #3b873e;
      color: #ffffff;
      border-radius: 16px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .tech-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StepTechnologyStackComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  config: TechnologyStackConfig = {
    frontend: {},
    backend: {}
  };

  architectureConfig: ArchitectureConfig = {
    projectTypes: [],
    frameworks: {}
  };

  constructor(private stepperService: BlueprintStepperService) {}

  ngOnInit(): void {
    this.stepperService.configuration$
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        this.config = { ...config.technologyStack };
        this.architectureConfig = { ...config.architecture };
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  updateConfiguration(): void {
    this.stepperService.updateTechnologyStack(this.config);
  }

  hasAnyConfiguration(): boolean {
    return !!(
      (this.architectureConfig.projectTypes.includes('frontend') && this.config.frontend.framework) ||
      (this.architectureConfig.projectTypes.includes('backend') && this.config.backend.framework)
    );
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
}