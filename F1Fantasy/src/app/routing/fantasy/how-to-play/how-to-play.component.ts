import { Component } from '@angular/core';
import {ContentContainerComponent} from "../../../shared/content-container/content-container.component";
import {CommonModule, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-how-to-play',
  imports: [
    ContentContainerComponent, CommonModule, NgIf, RouterLink
  ],
  templateUrl: './how-to-play.component.html',
  styleUrl: './how-to-play.component.scss'
})
export class HowToPlayComponent {
  selectedSection: 'build' | 'join' | 'transfers' | 'powerups' | 'race' | 'track' | 'ai' = 'build';

  selectSection(section: typeof this.selectedSection) {
      this.selectedSection = section;
    }
}
