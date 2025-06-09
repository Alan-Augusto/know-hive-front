import { Component } from '@angular/core';
import { HomeV1Component } from "../home-v1/home-v1.component";

@Component({
  selector: 'app-home-page',
  imports: [HomeV1Component],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
