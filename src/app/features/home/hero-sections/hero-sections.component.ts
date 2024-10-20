import { Component } from '@angular/core';
import { StatesComponent } from "./states/states.component";

@Component({
  selector: 'app-hero-sections',
  standalone: true,
  imports: [StatesComponent],
  templateUrl: './hero-sections.component.html',
  styleUrl: './hero-sections.component.scss'
})
export class HeroSectionsComponent {

}
