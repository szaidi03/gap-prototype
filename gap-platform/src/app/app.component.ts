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
    {
      label: 'ComplySyncATO',
      route: '/comply-sync',
      icon: 'assets/complysync_logo.svg',
      name: '',
    },
    {
      label: 'Hephaestus',
      route: '/hephaestus',
      icon: 'assets/hephaestus_logo.svg',
      name: '',
    },
    {
      label: 'CollabAI',
      route: '/collab-ai',
      icon: 'assets/collabai_logo.svg',
      name: '',
    },
    {
      label: 'GRANTS',
      route: '/grants',
      icon: 'assets/grants_logo.svg',
      name: '',
    },
    {
      label: 'Debt Mgmt.',
      route: '/debt',
      icon: 'assets/debt_logo.svg',
      name: '',
    },
    {
      label: 'ATHENA',
      route: '/athena',
      icon: 'assets/athena_logo.svg',
      name: '',
    },
    {
      label: 'Argus',
      route: '/argus',
      icon: 'assets/argus_logo.svg',
      name: '',
    },
    {
      label: 'Phoenix',
      route: '/phoenix',
      icon: 'assets/phoenix_logo.svg',
      name: '',
    },
  ];
}
