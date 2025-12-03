import { Component } from '@angular/core';
import {ContentContainerComponent} from "../../shared/content-container/content-container.component";

@Component({
  selector: 'app-page-not-found',
    imports: [
        ContentContainerComponent
    ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {

}
