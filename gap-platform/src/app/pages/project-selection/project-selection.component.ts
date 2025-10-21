import { Component } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

interface ProjectCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  name: string;
  accentClass: string;
}

@Component({
  selector: 'app-project-selection',
  standalone: true,
  imports: [NgFor, NgClass, NgIf],
  templateUrl: './project-selection.component.html',
  styleUrls: ['./project-selection.component.scss'],
})
export class ProjectSelectionComponent {
  readonly projects: ProjectCard[] = [
    {
      id: 'collab-ai',
      title: 'CollabAI',
      description:
        'Application that integrates with CollabWise to produce actionable insights across the enterprise.',
      icon: 'assets/collabai_logo.svg',
      name: 'assets/collabai_name.svg',
      accentClass: 'accent-blue',
    },
    {
      id: 'comply-sync',
      title: 'ComplySync ATO',
      description:
        'Accelerating Authority to Operate by connecting controls data to Manage Once! FedRAMP compliant baseline.',
      icon: 'assets/complysync_logo.svg',
      name: 'assets/complysync_name.svg',
      accentClass: 'accent-green',
    },
    {
      id: 'hephaestus',
      title: 'Hephaestus',
      description:
        'Application Platform Services with FedRAMP/StateRAMP interoperability resources.',
      icon: 'assets/hephaestus_logo.svg',
      name: 'assets/hephaestus_name.svg',
      accentClass: 'accent-orange',
    },
    {
      id: 'agados',
      title: 'Agados',
      description:
        'Provides an integrated suite of collaboration and automation tools to manage Clean Energy projects.',
      icon: 'assets/agados_logo.svg',
      name: '',
      accentClass: 'accent-purple',
    },
  ];

  constructor(private router: Router) {}

  get columnsOfProjects(): ProjectCard[][] {
    // Distribute projects across 4 columns
    const columns: ProjectCard[][] = [[], [], [], []];
    this.projects.forEach((project, index) => {
      const columnIndex = index % 4;
      columns[columnIndex].push(project);
    });
    return columns;
  }

  onProjectSelect(project: ProjectCard): void {
    // Navigate to project-specific blueprint stepper
    this.router.navigate([`/${project.id}/blueprint-stepper`, project.id, 'step', 1], {
      state: { project }
    });
  }
}
