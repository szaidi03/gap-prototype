import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ProjectCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  accentClass: string;
}

export interface ArchitectureConfig {
  projectTypes: string[];
  frameworks: {
    frontend?: string;
    backend?: string;
  };
}

export interface AppMetadata {
  projectName: string;
  description: string;
  domain: string;
  organization: string;
  businessOwner: string;
  productOwner: string;
}

export interface TechnologyStackConfig {
  frontend: {
    framework?: string;
    uiLibrary?: string;
    stateManagement?: string;
    styling?: string;
  };
  backend: {
    language?: string;
    framework?: string;
    database?: string;
    apiStyle?: string;
  };
}

export interface FeaturesConfig {
  authentication: {
    enabled: boolean;
    methods: string[];
  };
  database: {
    enabled: boolean;
    type?: string;
    features: string[];
  };
  integrations: {
    thirdParty: string[];
    realTime: string[];
  };
}

export interface DevToolsConfig {
  testing: {
    enabled: boolean;
    frameworks: string[];
    types: string[];
  };
  codeQuality: {
    enabled: boolean;
    tools: string[];
  };
  documentation: {
    enabled: boolean;
    tools: string[];
  };
}

export interface DeploymentConfig {
  containerization: {
    enabled: boolean;
    tools: string[];
  };
  cicd: {
    enabled: boolean;
    platform?: string;
    features: string[];
  };
  cloudProvider: {
    enabled: boolean;
    provider?: string;
    services: string[];
  };
  monitoring: {
    enabled: boolean;
    tools: string[];
  };
}

export interface BlueprintConfiguration {
  project: ProjectCard | null;
  metadata: AppMetadata;
  architecture: ArchitectureConfig;
  technologyStack: TechnologyStackConfig;
  features: FeaturesConfig;
  devTools: DevToolsConfig;
  deployment: DeploymentConfig;
}

export interface StepValidation {
  isValid: boolean;
  errors: string[];
}

export interface StepDefinition {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isValid: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BlueprintStepperService {
  private currentStepSubject = new BehaviorSubject<number>(1);
  private configurationSubject = new BehaviorSubject<BlueprintConfiguration>(this.getInitialConfig());

  currentStep$ = this.currentStepSubject.asObservable();
  configuration$ = this.configurationSubject.asObservable();

  readonly steps: StepDefinition[] = [
    { id: 1, title: 'Project Overview', description: 'Review your selected project and enter details', isCompleted: false, isValid: false },
    { id: 2, title: 'Technical Config', description: 'Configure architecture, stack, features, and dev tools', isCompleted: false, isValid: false },
    { id: 3, title: 'CI/CD & Deployment', description: 'Configure deployment and DevOps', isCompleted: false, isValid: false },
    { id: 4, title: 'Review', description: 'Review and generate blueprint', isCompleted: false, isValid: false }
  ];

  constructor() {
    // Initialize with project if available in sessionStorage
    this.loadFromSession();
  }

  private getInitialConfig(): BlueprintConfiguration {
    return {
      project: null,
      metadata: {
        projectName: '',
        description: '',
        domain: '',
        organization: '',
        businessOwner: '',
        productOwner: ''
      },
      architecture: {
        projectTypes: [],
        frameworks: {}
      },
      technologyStack: {
        frontend: {},
        backend: {}
      },
      features: {
        authentication: { enabled: false, methods: [] },
        database: { enabled: false, features: [] },
        integrations: { thirdParty: [], realTime: [] }
      },
      devTools: {
        testing: { enabled: false, frameworks: [], types: [] },
        codeQuality: { enabled: false, tools: [] },
        documentation: { enabled: false, tools: [] }
      },
      deployment: {
        containerization: { enabled: false, tools: [] },
        cicd: { enabled: false, features: [] },
        cloudProvider: { enabled: false, services: [] },
        monitoring: { enabled: false, tools: [] }
      }
    };
  }

  getCurrentStep(): number {
    return this.currentStepSubject.value;
  }

  getConfiguration(): BlueprintConfiguration {
    return this.configurationSubject.value;
  }

  setProject(project: ProjectCard): void {
    const config = this.getConfiguration();
    config.project = project;
    this.updateConfiguration(config);
    this.validateStep(1);
  }

  updateMetadata(metadata: Partial<AppMetadata>): void {
    const config = this.getConfiguration();
    config.metadata = { ...config.metadata, ...metadata };
    this.updateConfiguration(config);
    this.validateStep(1);
  }

  updateArchitecture(architecture: Partial<ArchitectureConfig>): void {
    const config = this.getConfiguration();
    config.architecture = { ...config.architecture, ...architecture };
    this.updateConfiguration(config);
    this.validateStep(2);
  }

  updateTechnologyStack(stack: Partial<TechnologyStackConfig>): void {
    const config = this.getConfiguration();
    config.technologyStack = { ...config.technologyStack, ...stack };
    this.updateConfiguration(config);
    this.validateStep(2);
  }

  updateFeatures(features: Partial<FeaturesConfig>): void {
    const config = this.getConfiguration();
    config.features = { ...config.features, ...features };
    this.updateConfiguration(config);
    this.validateStep(2);
  }

  updateDevTools(devTools: Partial<DevToolsConfig>): void {
    const config = this.getConfiguration();
    config.devTools = { ...config.devTools, ...devTools };
    this.updateConfiguration(config);
    this.validateStep(2);
  }

  updateDeployment(deployment: Partial<DeploymentConfig>): void {
    const config = this.getConfiguration();
    config.deployment = { ...config.deployment, ...deployment };
    this.updateConfiguration(config);
    this.validateStep(3);
  }

  private updateConfiguration(config: BlueprintConfiguration): void {
    this.configurationSubject.next(config);
    this.saveToSession();
  }

  goToStep(stepNumber: number): boolean {
    if (stepNumber < 1 || stepNumber > this.steps.length) {
      return false;
    }

    // Allow going to next step only if current and previous steps are valid
    if (stepNumber > this.getCurrentStep() + 1) {
      const canProceed = this.steps.slice(0, stepNumber - 1).every(step => step.isValid);
      if (!canProceed) {
        return false;
      }
    }

    this.currentStepSubject.next(stepNumber);
    return true;
  }

  nextStep(): boolean {
    const currentStep = this.getCurrentStep();
    if (currentStep >= this.steps.length) {
      return false;
    }

    if (!this.steps[currentStep - 1].isValid) {
      return false;
    }

    return this.goToStep(currentStep + 1);
  }

  previousStep(): boolean {
    const currentStep = this.getCurrentStep();
    if (currentStep <= 1) {
      return false;
    }

    return this.goToStep(currentStep - 1);
  }

  validateStep(stepNumber: number): StepValidation {
    const config = this.getConfiguration();
    let validation: StepValidation = { isValid: false, errors: [] };

    switch (stepNumber) {
      case 1:
        // Merged validation for project overview and metadata
        validation = this.validateProjectOverviewAndMetadata(config);
        break;
      case 2:
        // Combined validation for architecture, technology stack, features, and dev tools
        validation = this.validateTechnicalConfig(config);
        break;
      case 3:
        validation = this.validateDeployment(config);
        break;
      case 4:
        validation = this.validateReview(config);
        break;
    }

    // Update step validation state
    const stepIndex = stepNumber - 1;
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.steps[stepIndex].isValid = validation.isValid;
      this.steps[stepIndex].isCompleted = validation.isValid;
    }

    return validation;
  }

  private validateProjectOverviewAndMetadata(config: BlueprintConfiguration): StepValidation {
    const errors: string[] = [];

    // Validate project selection
    if (!config.project) {
      errors.push('Please select a project');
    }

    // Validate metadata
    const { metadata } = config;
    if (!metadata.projectName.trim()) {
      errors.push('Please enter a project name');
    }

    if (!metadata.description.trim()) {
      errors.push('Please enter a project description');
    }

    if (!metadata.organization.trim()) {
      errors.push('Please enter an organization name');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private validateTechnicalConfig(config: BlueprintConfiguration): StepValidation {
    const errors: string[] = [];
    const { architecture, technologyStack } = config;

    // Validate architecture
    if (architecture.projectTypes.length === 0) {
      errors.push('Please select at least one application type');
    }

    // Validate technology stack based on selected project types
    if (architecture.projectTypes.includes('frontend') && !technologyStack.frontend.framework) {
      errors.push('Please select a frontend framework');
    }

    if (architecture.projectTypes.includes('backend') && !technologyStack.backend.framework) {
      errors.push('Please select a backend framework');
    }

    // Features are optional, so no validation needed for features

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private validateArchitecture(config: BlueprintConfiguration): StepValidation {
    const errors: string[] = [];

    if (config.architecture.projectTypes.length === 0) {
      errors.push('Please select at least one application type');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private validateTechnologyStack(config: BlueprintConfiguration): StepValidation {
    const errors: string[] = [];
    const { architecture, technologyStack } = config;

    // Validate based on selected project types
    if (architecture.projectTypes.includes('frontend') && !technologyStack.frontend.framework) {
      errors.push('Please select a frontend framework');
    }

    if (architecture.projectTypes.includes('backend') && !technologyStack.backend.framework) {
      errors.push('Please select a backend framework');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private validateFeatures(config: BlueprintConfiguration): StepValidation {
    // Features are optional, so this step is always valid
    return { isValid: true, errors: [] };
  }

  private validateDeployment(config: BlueprintConfiguration): StepValidation {
    // Deployment is optional, so this step is always valid
    return { isValid: true, errors: [] };
  }

  private validateReview(config: BlueprintConfiguration): StepValidation {
    // Review step is valid if all required previous steps are valid
    const requiredSteps = [1, 2];
    const allValid = requiredSteps.every(stepNum => {
      const validation = this.validateStep(stepNum);
      return validation.isValid;
    });

    return {
      isValid: allValid,
      errors: allValid ? [] : ['Please complete all required steps']
    };
  }

  canProceedToNextStep(): boolean {
    const currentStep = this.getCurrentStep();
    const validation = this.validateStep(currentStep);
    return validation.isValid;
  }

  isStepAccessible(stepNumber: number): boolean {
    if (stepNumber === 1) return true;

    // Check if all previous steps are valid
    for (let i = 1; i < stepNumber; i++) {
      if (!this.steps[i - 1].isValid) {
        return false;
      }
    }

    return true;
  }

  reset(): void {
    this.currentStepSubject.next(1);
    this.configurationSubject.next(this.getInitialConfig());
    this.steps.forEach(step => {
      step.isCompleted = false;
      step.isValid = false;
    });
    this.clearSession();
  }

  private saveToSession(): void {
    try {
      const config = this.getConfiguration();
      sessionStorage.setItem('blueprint-config', JSON.stringify(config));
      sessionStorage.setItem('blueprint-current-step', this.getCurrentStep().toString());
    } catch (error) {
      console.warn('Failed to save to session storage:', error);
    }
  }

  private loadFromSession(): void {
    try {
      const savedConfig = sessionStorage.getItem('blueprint-config');
      const savedStep = sessionStorage.getItem('blueprint-current-step');

      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        this.configurationSubject.next(config);

        // Revalidate all steps
        for (let i = 1; i <= this.steps.length; i++) {
          this.validateStep(i);
        }
      }

      if (savedStep) {
        const stepNumber = parseInt(savedStep, 10);
        if (stepNumber >= 1 && stepNumber <= this.steps.length) {
          this.currentStepSubject.next(stepNumber);
        }
      }
    } catch (error) {
      console.warn('Failed to load from session storage:', error);
    }
  }

  private clearSession(): void {
    try {
      sessionStorage.removeItem('blueprint-config');
      sessionStorage.removeItem('blueprint-current-step');
    } catch (error) {
      console.warn('Failed to clear session storage:', error);
    }
  }
}