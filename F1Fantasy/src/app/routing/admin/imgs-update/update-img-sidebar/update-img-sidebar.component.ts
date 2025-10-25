import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-update-img-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterOutlet],
  templateUrl: './update-img-sidebar.component.html',
  styleUrl: './update-img-sidebar.component.scss'
})
export class UpdateImgSidebarComponent implements OnInit {
  // keep a list for rendering or future dynamic permissions
  readonly nav = [
    { path: 'drivers', label: 'Drivers' },
    { path: 'constructors', label: 'Constructors' },
    { path: 'circuits', label: 'Circuits' },
    { path: 'powerups', label: 'Powerups' },
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // if user opens /admin/imgs (no child) redirect to first pane
    const child = this.route.snapshot.firstChild;
    if (!child) {
      // navigate relative to current route
      this.router.navigate(['./drivers'], { relativeTo: this.route }).catch(() => {});
    }
  }
}
