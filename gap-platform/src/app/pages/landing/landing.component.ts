import { Component } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';

interface SolutionCard {
  title: string;
  description: string;
  icon: string;
  accentClass: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  readonly solutions: SolutionCard[] = [
    {
      title: 'CollabAI',
      description:
        'Application that integrates with CollabWise to produce actionable insights across the enterprise.',
      icon: 'collab-ai',
      accentClass: 'accent-blue',
    },
    {
      title: 'ComplySync ATO',
      description:
        'Accelerating Authority to Operate by connecting controls data to Manage Once! FedRAMP compliant baseline.',
      icon: 'comply-sync',
      accentClass: 'accent-green',
    },
    {
      title: 'Hephaestus',
      description:
        'Application Platform Services with FedRAMP/StateRAMP interoperability resources.',
      icon: 'hephaestus',
      accentClass: 'accent-orange',
    },
    {
      title: 'Agados',
      description:
        'Provides an integrated suite of collaboration and automation tools to manage Clean Energy projects.',
      icon: 'agados',
      accentClass: 'accent-purple',
    },
  ];
}
