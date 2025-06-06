import { Component, computed, effect, inject, signal } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonColorComponent } from "../button-color/button-color.component";
import { ButtonTheme } from "../button-theme/button-theme.component";
import { KhButtonComponent } from "../kh-button/kh-button.component";
import { UserIconComponent } from "../user-icon/user-icon.component";
import { Router } from '@angular/router';

@Component({
  selector: 'menu',
  imports: [TooltipModule, ButtonColorComponent, ButtonTheme, KhButtonComponent, UserIconComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  private router = inject(Router);

  isExpanded = signal(false);
  iconMenu = signal('ti ti-menu-2');
  titlePage = signal('🐝 KnowHive');

  goHome(){
    this.router.navigate(['/home']);
  }

}
