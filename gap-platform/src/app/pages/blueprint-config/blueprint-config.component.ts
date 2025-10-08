import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface ProjectCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  accentClass: string;
}

interface BlueprintConfig {
  projectType: string[];
  includeAuth: boolean;
  includeDatabase: boolean;
  includeApi: boolean;
  includeDocker: boolean;
  includeTesting: boolean;
  includeCI: boolean;
}

@Component({
  selector: 'app-blueprint-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blueprint-config.component.html',
  styleUrls: ['./blueprint-config.component.scss'],
})
export class BlueprintConfigComponent implements OnInit {
  project: ProjectCard | null = null;
  projectId: string = '';

  config: BlueprintConfig = {
    projectType: [],
    includeAuth: true,
    includeDatabase: true,
    includeApi: true,
    includeDocker: false,
    includeTesting: true,
    includeCI: false,
  };

  readonly projectTypes = [
    { id: 'frontend', label: 'Frontend Application', description: 'React/Angular/Vue.js application' },
    { id: 'backend', label: 'Backend API', description: 'REST/GraphQL API service' },
    { id: 'mobile', label: 'Mobile Application', description: 'iOS/Android mobile app' },
    { id: 'desktop', label: 'Desktop Application', description: 'Cross-platform desktop app' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId') || '';

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.project = navigation.extras.state['project'];
    }

    if (!this.project) {
      this.loadProjectFromId();
    }
  }

  private loadProjectFromId(): void {
    const projects: ProjectCard[] = [
      {
        id: 'collab-ai',
        title: 'CollabAI',
        description: 'Application that integrates with CollabWise to produce actionable insights across the enterprise.',
        icon: 'collab-ai',
        accentClass: 'accent-blue',
      },
      {
        id: 'comply-sync',
        title: 'ComplySync ATO',
        description: 'Accelerating Authority to Operate by connecting controls data to Manage Once! FedRAMP compliant baseline.',
        icon: 'comply-sync',
        accentClass: 'accent-green',
      },
      {
        id: 'hephaestus',
        title: 'Hephaestus',
        description: 'Application Platform Services with FedRAMP/StateRAMP interoperability resources.',
        icon: 'hephaestus',
        accentClass: 'accent-orange',
      },
      {
        id: 'agados',
        title: 'Agados',
        description: 'Provides an integrated suite of collaboration and automation tools to manage Clean Energy projects.',
        icon: 'agados',
        accentClass: 'accent-purple',
      },
    ];

    this.project = projects.find(p => p.id === this.projectId) || null;
  }

  onProjectTypeChange(projectType: string, checked: boolean): void {
    if (checked) {
      if (!this.config.projectType.includes(projectType)) {
        this.config.projectType.push(projectType);
      }
    } else {
      this.config.projectType = this.config.projectType.filter(type => type !== projectType);
    }
  }

  isProjectTypeSelected(projectType: string): boolean {
    return this.config.projectType.includes(projectType);
  }

  onBackToProjects(): void {
    this.router.navigate(['/project-selection']);
  }

  onGenerateBlueprint(): void {
    console.log('Generating blueprint for project:', this.project);
    console.log('Configuration:', this.config);

    alert(`Blueprint generation started for ${this.project?.title}!\n\nConfiguration:\n${JSON.stringify(this.config, null, 2)}`);
  }

  isConfigValid(): boolean {
    return this.config.projectType.length > 0;
  }
}