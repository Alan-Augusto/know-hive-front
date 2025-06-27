import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private router = inject(Router);


  isExpanded = signal(false);

  menuItems = signal([
    { id: 1, label: 'Início', url: 'home', icon: 'ti ti-home', active: false },
    { id: 2, label: 'Busca', url: 'public-search', icon: 'ti ti-hierarchy', active: false },
    { id: 3, label: 'Questões', url: 'questions', icon: 'ti ti-notebook', active: false },
    { id: 4, label: 'Coleções', url: 'collections', icon: 'ti ti-folder', active: false },
    { id: 5, label: 'Favoritos', url: 'favorites', icon: 'ti ti-heart', active: false },
    // { id: 6, label: 'Compartilhados Comigo', url: 'shared-with-me', icon: 'ti ti-users', active: false },
    { id: 7, label: 'Estatísticas', url: 'statistics', icon: 'ti ti-chart-bar', active: false },
  ]);

  toggleMenu() {
    this.isExpanded.update(expanded => !expanded);
  }

  setActiveMenuItemFromUrl() {
    const currentUrl = this.router.url;
    const activeItem = this.menuItems().find(item => currentUrl.includes(item.url));
    if (activeItem) {
      this.activateMenuItem(activeItem.id);
    }
  }

    goHome() {
    this.router.navigate(['/home']);
  }

  redirectTo(url: string) {
    this.router.navigate([`/${url}`]);
    this.setActiveMenuItemFromUrl();
  }

  activateMenuItem(itemId: number) {
    this.menuItems.update(items => {
      return items.map(item => ({
        ...item,
        active: item.id === itemId
      }));
    });
  }

}
