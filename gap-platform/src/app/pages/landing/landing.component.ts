import { Component } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

interface SolutionCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  accentClass: string;
  isClickable: boolean;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [NgFor, NgClass, NgIf],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  readonly solutions: SolutionCard[] = [
    {
      id: 'comply-sync-ai',
      title: 'ComplySync AI',
      description: 'Accelerating Security, Governance Controls, and the ATO Process to Manage Cyber Risks',
      icon: 'comply-sync-ai',
      accentClass: 'accent-green',
      isClickable: false,
    },
    {
      id: 'hephaestus',
      title: 'Hephaestus',
      description: 'Application Platform as a Service (aPaaS) for Fast Healthcare Interoperability Resources (FHIR®)',
      icon: 'hephaestus',
      accentClass: 'accent-orange',
      isClickable: false,
    },
    {
      id: 'collab-ai',
      title: 'Collab AI',
      description: 'An Advanced AI Platform that Reshapes How Businesses Gather Valuable Insights from Their Content',
      icon: 'collab-ai',
      accentClass: 'accent-blue',
      isClickable: false,
    },
    {
      id: 'grants',
      title: 'GRANTS',
      description: 'Grants Made Easy, Results Made Visible While Empowering Federal Agencies with an End-to-End Grants Management Solution',
      icon: 'grants',
      accentClass: 'accent-teal',
      isClickable: false,
    },
    {
      id: 'assyst-debt-mgmt',
      title: 'ASSYST Debt Mgmt.',
      description: 'Facilitating Real-time Decision Making in Debt and Case Management Through the Integration of Advanced Analytics and AI/ML',
      icon: 'assyst-debt',
      accentClass: 'accent-purple',
      isClickable: false,
    },
    {
      id: 'assyst-sdl-askme',
      title: 'ASSYST SDL AskMe',
      description: 'Improve Holistic Threat Intelligence Through Actionable Insights',
      icon: 'assyst-sdl',
      accentClass: 'accent-red',
      isClickable: false,
    },
    {
      id: 'assyst-test-automation',
      title: 'ASSYST Test Automation',
      description: 'A Cloud-based Test Automation Platform for Improving Quality Assurance',
      icon: 'assyst-test',
      accentClass: 'accent-indigo',
      isClickable: false,
    },
    {
      id: 'phoenix',
      title: 'Phoenix',
      description: 'Blueprint Generation Platform - Create customized application blueprints for rapid development',
      icon: 'phoenix',
      accentClass: 'accent-primary',
      isClickable: true,
    },
  ];

  constructor(private router: Router) {}

  onSolutionClick(solution: SolutionCard): void {
    if (solution.isClickable && solution.id === 'phoenix') {
      this.router.navigate(['/project-selection']);
    }
    // For other solutions, show coming soon or do nothing for now
  }
}
