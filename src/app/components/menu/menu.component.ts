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
  titlePage = signal('🐝 KnowHive');

  menuItems = signal([
    // { label: 'Home', icon: 'ti ti-home', command: () => this.goHome() },
    { id: 2, label: 'Início', url:'home', icon: 'ti ti-home', active:true},
    { id: 2, label: 'Questões', url:'questions', icon: 'ti ti-help', active:false},
    { id: 3, label: 'Coleções', url:'collections', icon: 'ti ti-folder', active:false},
    { id: 4, label: 'Compartilhados Comigo', url:'shared-with-me', icon: 'ti ti-users', active:false},
    { id: 5, label: 'Estatísticas', url:'statistics', icon: 'ti ti-chart-bar', active:false}
  ]);

  goHome(){
    this.router.navigate(['/home']);
  }

  redirectTo(url: string) {
    this.router.navigate([`/${url}`]);
    this.isExpanded.set(false);
  }


}
