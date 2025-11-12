import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ContentContainerComponent} from '../content-container/content-container.component';

@Component({
  selector: 'app-statistic-container',
  imports: [CommonModule, ContentContainerComponent, RouterModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './statistic-container.component.html',
  styleUrl: './statistic-container.component.scss'
})
export class StatisticContainerComponent {
  constructor(private router: Router) {}

  // derive active section from URL for select default
  getActive(): string {
        const url = this.router.url || '';
        if (url.includes('/statistic/constructors')) return 'constructors';
        if (url.includes('/statistic/players')) return 'players';
        if (url.includes('/statistic/races')) return 'races';
        return 'drivers';
      }

  onSwitch(value: string) {
        // navigate to /statistic/<value>
          this.router.navigateByUrl(`/statistic/${value}`).catch(() => {});
      }
}
