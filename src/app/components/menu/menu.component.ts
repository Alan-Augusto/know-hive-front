import { Component, computed, effect, inject, signal } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonColorComponent } from "../button-color/button-color.component";
import { ButtonTheme } from "../button-theme/button-theme.component";
import { UserIconComponent } from "../user-icon/user-icon.component";
import { Router } from '@angular/router';
import { MenuService } from './menu.service';

@Component({
  selector: 'menu',
  imports: [TooltipModule, ButtonColorComponent, ButtonTheme, UserIconComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  private menuService = inject(MenuService);

  titlePage = signal('🐝 KnowHive');

  isExpanded = computed(() => this.menuService.isExpanded());
  menuItems = computed(() => this.menuService.menuItems());

  ngOnInit() {
    this.menuService.setActiveMenuItemFromUrl();
  }

  toggleMenu() {
    this.menuService.toggleMenu();
  }

  redirectTo(url: string) {
    this.menuService.redirectTo(url);
  }







}
