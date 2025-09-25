import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-fantasy-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './fantasy-nav.component.html',
  styleUrl: './fantasy-nav.component.scss'
})
export class FantasyNavComponent {}
