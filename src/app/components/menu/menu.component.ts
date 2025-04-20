import { Component, signal } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonColorComponent } from "../button-color/button-color.component";
import { ButtonTheme } from "../button-theme/button-theme.component";

@Component({
  selector: 'menu',
  imports: [TooltipModule, ButtonColorComponent, ButtonTheme],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  isExpanded = signal(false);
}
