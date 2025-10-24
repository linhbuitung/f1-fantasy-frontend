import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterModule, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ContentContainerComponent} from '../content-container/content-container.component';

@Component({
  selector: 'app-statistic-container',
  imports: [CommonModule, ContentContainerComponent, RouterModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './statistic-container.component.html',
  styleUrl: './statistic-container.component.scss'
})
export class StatisticContainerComponent {

}
