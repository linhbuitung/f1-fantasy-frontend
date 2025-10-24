import { Component } from '@angular/core';
import { ContentContainerComponent } from "../../../shared/content-container/content-container.component";
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-rules',
  standalone: true,
  imports: [ContentContainerComponent, CommonModule, NgIf],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss'
})
export class RulesComponent {
  // sections: keep concise keys
  selectedSection: 'team' | 'transfers' | 'scoring' | 'powerups' | 'leagues' | 'ai' = 'team';

  selectSection(section: typeof this.selectedSection) {
    this.selectedSection = section;
  }
}
