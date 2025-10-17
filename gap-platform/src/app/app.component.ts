import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  name: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgFor, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  sidebarOpen: boolean = true;
  readonly navItems: NavItem[] = [
    // {
    //   label: 'Generate Blueprint',
    //   route: '/project-selection',
    //   icon: 'auto_awesome_motion',
    //   name: '',
    // },
    {
      label: 'ComplySyncATO',
      route: '/project-selection',
      icon: 'assets/complysync_logo.svg',
      name: '',
    },
    {
      label: 'Hephaestus',
      route: '/project-selection',
      icon: 'assets/hephaestus_logo.svg',
      name: '',
    },
    {
      label: 'CollabAI',
      route: '/project-selection',
      icon: 'assets/collabai_logo.svg',
      name: '',
    },
    {
      label: 'GRANTS',
      route: '/project-selection',
      icon: 'assets/grants_logo.svg',
      name: '',
    },
    {
      label: 'Debt Mgmt.',
      route: '/project-selection',
      icon: 'assets/debt_logo.svg',
      name: '',
    },
    {
      label: 'ATHENA',
      route: '/project-selection',
      icon: 'assets/athena_logo.svg',
      name: '',
    },
    {
      label: 'Argus',
      route: '/project-selection',
      icon: 'assets/argus_logo.svg',
      name: '',
    },
    {
      label: 'Phoenix',
      route: '/project-selection',
      icon: 'assets/phoenix_logo.svg',
      name: '',
    },
  ];
}
