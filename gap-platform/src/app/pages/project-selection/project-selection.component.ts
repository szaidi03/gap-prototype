import { Component } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { Router } from '@angular/router';

interface ProjectCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  accentClass: string;
}

@Component({
  selector: 'app-project-selection',
  standalone: true,
  imports: [NgFor, NgClass],
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
      icon: 'collab-ai',
      accentClass: 'accent-blue',
    },
    {
      id: 'comply-sync',
      title: 'ComplySync ATO',
      description:
        'Accelerating Authority to Operate by connecting controls data to Manage Once! FedRAMP compliant baseline.',
      icon: 'comply-sync',
      accentClass: 'accent-green',
    },
    {
      id: 'hephaestus',
      title: 'Hephaestus',
      description:
        'Application Platform Services with FedRAMP/StateRAMP interoperability resources.',
      icon: 'hephaestus',
      accentClass: 'accent-orange',
    },
    {
      id: 'agados',
      title: 'Agados',
      description:
        'Provides an integrated suite of collaboration and automation tools to manage Clean Energy projects.',
      icon: 'agados',
      accentClass: 'accent-purple',
    },
  ];

  constructor(private router: Router) {}

  onProjectSelect(project: ProjectCard): void {
    this.router.navigate(['/blueprint-stepper', project.id, 'step', 1], {
      state: { project }
    });
  }
}