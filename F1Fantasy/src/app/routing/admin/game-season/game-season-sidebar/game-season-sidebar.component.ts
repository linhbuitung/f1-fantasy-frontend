import { Component } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-game-season-sidebar',
    imports: [
        NgForOf,
        NgIf,
        RouterLink,
        RouterLinkActive,
        RouterOutlet
    ],
  templateUrl: './game-season-sidebar.component.html',
  styleUrl: './game-season-sidebar.component.scss'
})
export class GameSeasonSidebarComponent {
  // keep a list for rendering or future dynamic permissions
  readonly nav = [
    { path: 'season', label: 'Active season' },
    { path: 'pickable-items', label: 'Pickable items' }
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // if user opens /admin/imgs (no child) redirect to first pane
    const child = this.route.snapshot.firstChild;
    if (!child) {
      // navigate relative to current route
      this.router.navigate(['./season'], { relativeTo: this.route }).catch(() => {});
    }
  }
}
