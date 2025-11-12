import { Component } from '@angular/core';
import {ContentContainerComponent} from "../content-container/content-container.component";
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
@Component({
  selector: 'app-admin-container',
    imports: [
        ContentContainerComponent,
        RouterLink,
        RouterLinkActive,
        RouterOutlet
    ],
  templateUrl: './admin-container.component.html',
  styleUrl: './admin-container.component.scss'
})
export class AdminContainerComponent {
  constructor(private router: Router) {}

  // derive active section from URL for select default
  getActive(): string {
        const url = this.router.url || '';
        if (url.includes('/admin/public-league')) return 'public-league';
        if (url.includes('/admin/game-season')) return 'game-season';
        if (url.includes('/admin/user')) return 'user';
        return 'imgs'; // default
      }

  onSwitch(value: string) {
        // navigate to /admin/<value>
          this.router.navigateByUrl(`/admin/${value}`).catch(() => {});
      }
}
