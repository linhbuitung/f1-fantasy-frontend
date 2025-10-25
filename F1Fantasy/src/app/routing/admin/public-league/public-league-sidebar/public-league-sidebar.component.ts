import { Component } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-public-league-sidebar',
    imports: [
        NgForOf,
        NgIf,
        RouterLink,
        RouterLinkActive,
        RouterOutlet
    ],
  templateUrl: './public-league-sidebar.component.html',
  styleUrl: './public-league-sidebar.component.scss'
})
export class PublicLeagueSidebarComponent {
  // keep a list for rendering or future dynamic permissions
  readonly nav = [
    { path: 'manage', label: 'Manage' },
    { path: 'create', label: 'Create' }
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // if user opens /admin/imgs (no child) redirect to first pane
    const child = this.route.snapshot.firstChild;
    if (!child) {
      // navigate relative to current route
      this.router.navigate(['./manage'], { relativeTo: this.route }).catch(() => {});
    }
  }
}
