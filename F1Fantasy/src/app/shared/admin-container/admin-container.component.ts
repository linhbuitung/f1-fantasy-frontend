import { Component } from '@angular/core';
import {ContentContainerComponent} from "../content-container/content-container.component";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
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
  constructor() {
  }
}
