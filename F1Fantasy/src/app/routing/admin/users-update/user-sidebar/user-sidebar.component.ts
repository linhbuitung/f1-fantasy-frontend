import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-user-sidebar',
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './user-sidebar.component.html',
  styleUrl: './user-sidebar.component.scss'
})
export class UserSidebarComponent {
  // keep a list for rendering or future dynamic permissions
  readonly nav = [
    { path: 'roles', label: 'User roles' },
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // if user opens /admin/imgs (no child) redirect to first pane
    const child = this.route.snapshot.firstChild;
    if (!child) {
      // navigate relative to current route
      this.router.navigate(['./roles'], { relativeTo: this.route }).catch(() => {});
    }
  }
}
