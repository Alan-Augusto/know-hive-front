import { Component, computed, effect, signal } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonColorComponent } from "../button-color/button-color.component";
import { ButtonTheme } from "../button-theme/button-theme.component";
import { KhButtonComponent } from "../kh-button/kh-button.component";

@Component({
  selector: 'menu',
  imports: [TooltipModule, ButtonColorComponent, ButtonTheme, KhButtonComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  isExpanded = signal(false);
  iconMenu = signal('ti ti-menu-2');
  titlePage = signal('🐝 KnowHive');
}
