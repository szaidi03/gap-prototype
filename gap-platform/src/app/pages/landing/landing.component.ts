import { Component } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

interface SolutionCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  name: string;
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
      title: 'ComplySyncATO',
      description: 'Accelerating Security, Governance Controls, and the ATO Process to Manage Cyber Risks',
      icon: 'assets/complysync_logo.svg',
      name: 'assets/complysync_name.svg',
      accentClass: 'accent-green',
      isClickable: false,
    },
    {
      id: 'hephaestus',
      title: 'Hephaestus',
      description: 'Application Platform as a Service (aPaaS) for Fast Healthcare Interoperability Resources (FHIR®)',
      icon: 'assets/hephaestus_logo.svg',
      name: 'assets/hephaestus_name.svg',
      accentClass: 'accent-orange',
      isClickable: false,
    },
    {
      id: 'collab-ai',
      title: 'CollabAI',
      description: 'An Advanced AI Platform that Reshapes How Businesses Gather Valuable Insights from Their Content',
      icon: 'assets/collabai_logo.svg',
      name: 'assets/collabai_name.svg',
      accentClass: 'accent-blue',
      isClickable: false,
    },
    {
      id: 'grants',
      title: 'GRANTS',
      description: 'Grants Made Easy, Results Made Visible While Empowering Federal Agencies with an End-to-End Grants Management Solution',
      icon: 'assets/grants_logo.svg',
      name: 'assets/grants_name.svg',
      accentClass: 'accent-teal',
      isClickable: false,
    },
    {
      id: 'debt',
      title: 'Debt Mgmt.',
      description: 'Facilitating Real-time Decision Making in Debt and Case Management Through the Integration of Advanced Analytics and AI/ML',
      icon: 'assets/debt_logo.svg',
      name: '',
      accentClass: 'accent-purple',
      isClickable: false,
    },
    {
      id: 'athena',
      title: 'ATHENA',
      description: 'Improve Holistic Threat Intelligence Through Actionable Insights',
      icon: 'assets/athena_logo.svg',
      name: 'assets/athena_name.svg',
      accentClass: 'accent-red',
      isClickable: false,
    },
    {
      id: 'argus',
      title: 'Argus',
      description: 'A Cloud-based Test Automation Platform for Improving Quality Assurance',
      icon: 'assets/argus_logo.svg',
      name: '',
      accentClass: 'accent-indigo',
      isClickable: false,
    },
    {
      id: 'phoenix',
      title: 'Phoenix',
      description: 'Blueprint Generation Platform - Create customized application blueprints for rapid development',
      icon: 'assets/phoenix_logo.svg',
      name: '',
      accentClass: 'accent-primary',
      isClickable: true,
    },
  ];

  constructor(private router: Router) {}

  get columnsOfSolutions(): SolutionCard[][] {
    // Distribute solutions across 4 columns
    const columns: SolutionCard[][] = [[], [], [], []];
    this.solutions.forEach((solution, index) => {
      const columnIndex = index % 4;
      columns[columnIndex].push(solution);
    });
    return columns;
  }

  onSolutionClick(solution: SolutionCard): void {
    if (solution.isClickable && solution.id === 'phoenix') {
      this.router.navigate(['/phoenix']);
    }
    // For other solutions, show coming soon or do nothing for now
  }
}
